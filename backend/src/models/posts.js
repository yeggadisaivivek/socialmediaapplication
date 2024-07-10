const db = require('../db');
const { uploadImageToS3Bucket } = require('../utils/awsUtil');

const getPost = async (postID) => {
    try {
        const sql = `SELECT * FROM posts WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [postID], (err, results) => {
                if (err) {
                    reject({ error: err.message });
                } else if (results.length === 0) {
                    resolve({ error: "Posts not found" });
                } else {
                    resolve(results[0]);
                }
            });
        });
    } catch (error) {
        return { error: error.message };
    }
}

const createPost = async (userID, caption, profilePicBase64Encoded) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // Upload the image to S3
        const profilePicUrl = await uploadImageToS3Bucket(profilePicBase64Encoded);

        // Insert new post
        const newPost = {
            user_id: userID,
            caption,
            post_url: profilePicUrl,
            likes_count: 0,
            comments_count: 0
        };
        const sqlInsertPost = `INSERT INTO posts SET ?`;
        const postResult = await new Promise((resolve, reject) => {
            connection.query(sqlInsertPost, newPost, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        const postId = postResult.insertId;

        // Insert into likes_of_post
        const newLikesOfPost = {
            post_id: postId,
            liked_by_users: JSON.stringify([])
        };
        const sqlInsertLikesOfPost = `INSERT INTO likes_of_post SET ?`;
        await new Promise((resolve, reject) => {
            connection.query(sqlInsertLikesOfPost, newLikesOfPost, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        // Insert into comments_of_post
        const newCommentsOfPost = {
            post_id: postId,
            comments: JSON.stringify([])
        };
        const sqlInsertCommentsOfPost = `INSERT INTO comments_of_post SET ?`;
        await new Promise((resolve, reject) => {
            connection.query(sqlInsertCommentsOfPost, newCommentsOfPost, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        await connection.commit();
        connection.release();

        return { message: "Inserted Successfully" };
    } catch (error) {
        await connection.rollback();
        connection.release();
        return { error: "Error: " + error.message };
    }
};

const updatePost = async (postID, caption, profilePicBase64Encoded) => {
    try {
        // First, retrieve the current profile picture key from the database
        const sqlSelect = `SELECT post_url FROM posts WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sqlSelect, [postID], async (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                if (results.length === 0) {
                    return reject({ error: "Post not found" });
                }

                const currentProfilePicKey = results[0].post_url;
                let profilePicKey = currentProfilePicKey;

                // If a new profile picture is provided, upload it to S3 and delete the old one
                if (profilePicBase64Encoded) {
                    try {
                        profilePicKey = await uploadImageToS3Bucket(profilePicBase64Encoded);

                        // Delete the old image if it exists
                        if (currentProfilePicKey) {
                            await deleteImageFromS3Bucket(currentProfilePicKey);
                        }
                    } catch (uploadErr) {
                        return reject({ error: uploadErr.message });
                    }
                }

                const updatePostData = {
                    caption,
                    post_url: profilePicKey
                };

                const sqlUpdate = `UPDATE posts SET ? WHERE id = ?`;
                db.query(sqlUpdate, [updatePostData, postID], (updateErr, updateResults) => {
                    if (updateErr) {
                        return reject({ error: updateErr.message });
                    }
                    resolve({ message: 'Posts data updated successfully', results: updateResults });
                });
            });
        });
    } catch (error) {
        return { error: error.message };
    }
} 

const deletePost = async (postID) => {
    try {
        const sql = `DELETE FROM posts WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [postID], (err, results) => {
                if (err) {
                    reject({ error: err.message });
                } else {
                    resolve({ message: "Deleted Successfully" });
                }
            });
        });
    } catch (error) {
        return { error: error.message };
    }
};

const getAllPostsOfUser = async (userID) => {
    try {
        const sql = `SELECT * FROM posts WHERE user_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [userID], (err, results) => {
                if (err) {
                    reject({ error: err.message });
                } else if (results.length === 0) {
                    resolve({ error: "Posts not found" });
                } else {
                    resolve(results[0]);
                }
            });
        });
    } catch (error) {
        return { error: error.message };
    }
};

const allPosts = async (userID) => {
    const sqlSelectFollowers = `SELECT list_of_followers FROM followers WHERE user_id = ?`;
    const sqlSelectPosts = `SELECT * FROM posts WHERE user_id IN (?)`;

    try {
        // Select the list of followers
        const [results] = await new Promise((resolve, reject) => {
            db.query(sqlSelectFollowers, [userID], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        // Parse the list of followers
        const followerIDs = JSON.parse(results[0].list_of_followers || '[]');
        followerIDs.push(userID)

        // Select the user data for the followers
        const [postResults] = await new Promise((resolve, reject) => {
            db.query(sqlSelectPosts, [followerIDs], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        return { posts: postResults };

    } catch (error) {
        return { error: error.message };
    }
};

module.exports = { getPost, createPost, updatePost, deletePost, allPosts, getAllPostsOfUser };