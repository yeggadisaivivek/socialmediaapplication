const db = require('../db.js');
const { uploadImageToS3Bucket, getSignedURLFromS3Bucket, deleteImageFromS3Bucket } = require('../utils/awsUtil');
const { getUsernameByUserId } = require('./userData.js');

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

const createPost = async (userID, caption, mediaType, profilePicUrl) => {
    const connection = db;
    //connection.release();
    try {
        //await connection.beginTransaction();

        // Insert new post
        const newPost = {
            user_id: userID,
            caption,
            post_url: profilePicUrl,
            media_type: mediaType,
            likes_count: 0,
            comments_count: 0
        };
        const sqlInsertPost = `INSERT INTO posts SET ?`;
        const postResult = await new Promise((resolve, reject) => {
            connection.query(sqlInsertPost, newPost, (err, results) => {
                if (err) {
                    console.log("error in postresult", err)
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
                    console.log("error in likes_of_post", err)
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
                    console.log("error in comments_of_post", err)
                    return reject(err);
                }
                resolve(results);
            });
        });

       // await connection.commit();
        //connection.release();

        return { message: "Inserted Successfully" };
    } catch (error) {
        //await connection.rollback();
        //connection.release();
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
    const selectSqlPosts = `SELECT post_url FROM posts WHERE id = ?`
    const delteSqlPosts = `DELETE FROM posts WHERE id = ?`;
    const deleteSqlLikes = `DELETE FROM likes_of_post where post_id = ?`;
    const deleteSqlComment = `DELETE FROM comments_of_post where post_id = ?`
    try {
        await new Promise((resolve, reject) => {
            db.query(selectSqlPosts, [postID], async (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                if (results.length === 0) {
                    return reject({ error: "Post not found" });
                }
                await deleteImageFromS3Bucket(results[0].post_url);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.query(deleteSqlLikes, [postID], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });

        await new Promise((resolve, reject) => {
            db.query(deleteSqlComment, [postID], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });

        const x = await new Promise((resolve, reject) => {
            db.query(delteSqlPosts, [postID], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });

        return { message: "Deleted the Post Successfully" }
    } catch (error) {
        return { error: error.message };
    }
};

const getAllPostsOfUser = async (userID) => {
    const sqlSelectPosts = `
        SELECT 
            p.*, 
            u.name, 
            u.profile_pic_url, 
            COALESCE(l.likes_count, 0) AS likes_count,
            COALESCE(c.comments_count, 0) AS comments_count,
            COALESCE(c.comments, '[]') AS comments
        FROM 
            posts p
        LEFT JOIN 
            user_data u ON p.user_id = u.user_id
        LEFT JOIN 
            (SELECT post_id, SUM(JSON_LENGTH(liked_by_users)) AS likes_count
             FROM likes_of_post
             GROUP BY post_id) l ON p.id = l.post_id
        LEFT JOIN 
            (SELECT post_id, JSON_LENGTH(comments) AS comments_count, comments
             FROM comments_of_post) c ON p.id = c.post_id
        WHERE 
            p.user_id IN (?)
        ORDER BY 
            p.created_at DESC
    `;
    
    const sqlSelectUsers = `SELECT user_id, name FROM user_data WHERE user_id IN (?)`;

    try {
        const followerIDs = [];
        followerIDs.push(userID);

        // Select posts with user details, likes, and comments
        const postResults = await new Promise((resolve, reject) => {
            db.query(sqlSelectPosts, [followerIDs], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });

        // Extract user IDs from comments for querying
        const commentUserIds = postResults.flatMap(post => 
            JSON.parse(post.comments || '[]').map(comment => comment.user_id)
        );
        
        // Fetch user names for comments
        const uniqueUserIds = [...new Set(commentUserIds)];
        let userMap = [];
        if(uniqueUserIds && uniqueUserIds.length > 0) {
        const userResults = await new Promise((resolve, reject) => {
            db.query(sqlSelectUsers, [uniqueUserIds], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });

        // Create a map for quick user lookup
        userMap = userResults.reduce((acc, user) => {
            acc[user.user_id] = user.name;
            return acc;
        }, {});
    }

        // Process posts to attach signed URLs and user names to comments
        const postsWithDetails = await Promise.all(postResults.map(async post => {
            if (post.profile_pic_url) {
                post.profile_pic_url = await getSignedURLFromS3Bucket(post.profile_pic_url);
            }
            if (post.post_url) {
                post.post_url = await getSignedURLFromS3Bucket(post.post_url);
            }
            let comments = JSON.parse(post.comments || '[]');
            comments = comments.map(comment => {
                if (comment.user_id) {
                    comment.username = userMap[comment.user_id] || 'Unknown';
                }
                return comment;
            });
            post.comments = comments;
            return post;
        }));

        return { posts: postsWithDetails };

    } catch (error) {
        return { error: error.message };
    }
};

const allPosts = async (userID) => {
    const sqlSelectFollowers = `SELECT list_of_followers FROM followers WHERE user_id = ?`;
    const sqlSelectPosts = `
        SELECT 
            p.*, 
            u.name, 
            u.profile_pic_url, 
            COALESCE(l.likes_count, 0) AS likes_count,
            COALESCE(c.comments_count, 0) AS comments_count,
            COALESCE(c.comments, '[]') AS comments
        FROM 
            posts p
        LEFT JOIN 
            user_data u ON p.user_id = u.user_id
        LEFT JOIN 
            (SELECT post_id, SUM(JSON_LENGTH(liked_by_users)) AS likes_count
             FROM likes_of_post
             GROUP BY post_id) l ON p.id = l.post_id
        LEFT JOIN 
            (SELECT post_id, JSON_LENGTH(comments) AS comments_count, comments
             FROM comments_of_post) c ON p.id = c.post_id
        WHERE 
            p.user_id IN (10)
        ORDER BY 
            p.created_at DESC
    `;
    
    const sqlSelectUsers = `SELECT user_id, name FROM user_data WHERE user_id IN (?)`;

    try {
        // Select the list of followers
        const followerResults = await new Promise((resolve, reject) => {
            db.query(sqlSelectFollowers, [userID], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });

        // Parse the list of followers and include the user ID
        const followerIDs = followerResults[0].list_of_followers || [] ;
        if(typeof followerIDs === 'number'){
            
        }
        followerIDs.push(userID);
        // Select posts with user details, likes, and comments
        const postResults = await new Promise((resolve, reject) => {
            db.query(sqlSelectPosts, [followerIDs], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });
        // Extract user IDs from comments for querying
        const commentUserIds = postResults.flatMap(post => 
            JSON.parse(post.comments || '[]').map(comment => comment.user_id)
        ) ;
        
        // Fetch user names for comments
        const uniqueUserIds = [...new Set(commentUserIds)];
        let userMap = [];
        if(uniqueUserIds && uniqueUserIds.length > 0) {
        const userResults = await new Promise((resolve, reject) => {
            db.query(sqlSelectUsers, [uniqueUserIds], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });
        // Create a map for quick user lookup
        userMap = userResults.reduce((acc, user) => {
            acc[user.user_id] = user.name;
            return acc;
        }, {});
    }

        // Process posts to attach signed URLs and user names to comments
        const postsWithDetails = await Promise.all(postResults.map(async post => {
            if (post.profile_pic_url) {
                post.profile_pic_url = await getSignedURLFromS3Bucket(post.profile_pic_url);
            }
            if (post.post_url) {
                post.post_url = await getSignedURLFromS3Bucket(post.post_url);
            }
            let comments = JSON.parse(post.comments || '[]');
            comments = comments.map(comment => {
                if (comment.user_id) {
                    comment.username = userMap[comment.user_id] || 'Unknown';
                }
                return comment;
            });
            post.comments = comments;
            return post;
        }));

        return { posts: postsWithDetails };

    } catch (error) {
        return { error: error.message };
    }
};

module.exports = { getPost, createPost, updatePost, deletePost, allPosts, getAllPostsOfUser };