const pool = require('../db.js');
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
    const sqlInsertPost = 'INSERT INTO posts SET ?';
    const sqlInsertLikesOfPost = 'INSERT INTO likes_of_post SET ?';
    const sqlInsertCommentsOfPost = 'INSERT INTO comments_of_post SET ?';

    try {
        // Insert new post
        const newPost = {
            user_id: userID,
            caption,
            post_url: profilePicUrl,
            media_type: mediaType,
            likes_count: 0,
            comments_count: 0
        };
        const [postResult] = await pool.query(sqlInsertPost, newPost);

        const postId = postResult.insertId;

        // Insert into likes_of_post
        const newLikesOfPost = {
            post_id: postId,
            liked_by_users: JSON.stringify([])
        };
        await pool.query(sqlInsertLikesOfPost, newLikesOfPost);

        // Insert into comments_of_post
        const newCommentsOfPost = {
            post_id: postId,
            comments: JSON.stringify([])
        };
        await pool.query(sqlInsertCommentsOfPost, newCommentsOfPost);

        return { message: 'Inserted Successfully' };
    } catch (error) {
        return { error: 'Error: ' + error.message };
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
    const selectSqlPosts = 'SELECT post_url FROM posts WHERE id = ?';
    const deleteSqlPosts = 'DELETE FROM posts WHERE id = ?';
    const deleteSqlLikes = 'DELETE FROM likes_of_post WHERE post_id = ?';
    const deleteSqlComments = 'DELETE FROM comments_of_post WHERE post_id = ?';

    try {
        // Select the post URL for deletion from S3
        const [postResults] = await pool.query(selectSqlPosts, [postID]);
        if (postResults.length === 0) {
            throw new Error('Post not found');
        }

        // Delete the image from S3
        await deleteImageFromS3Bucket(postResults[0].post_url);

        // Delete from likes_of_post table
        await pool.query(deleteSqlLikes, [postID]);

        // Delete from comments_of_post table
        await pool.query(deleteSqlComments, [postID]);

        // Delete from posts table
        await pool.query(deleteSqlPosts, [postID]);

        return { message: 'Deleted the Post Successfully' };
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
            p.user_id = ?
        ORDER BY 
            p.created_at DESC
    `;
    
    const sqlSelectUsers = 'SELECT user_id, name FROM user_data WHERE user_id IN (?)';

    try {
        // Fetch posts by user
        const [postResults] = await pool.query(sqlSelectPosts, [userID]);

        // Extract user IDs from comments for querying
        const commentUserIds = postResults.flatMap(post => 
            JSON.parse(post.comments || '[]').map(comment => comment.user_id)
        );

        // Fetch user names for comments
        const uniqueUserIds = [...new Set(commentUserIds)];
        let userMap = {};
        if (uniqueUserIds.length > 0) {
            const [userResults] = await pool.query(sqlSelectUsers, [uniqueUserIds]);

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
    const sqlSelectFollowers = `
    SELECT user_id 
    FROM followers 
    WHERE JSON_CONTAINS(list_of_followers, JSON_ARRAY(?), '$')`;
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
    
    const sqlSelectUsers = 'SELECT user_id, name FROM user_data WHERE user_id IN (?)';

    try {
        // Select the list of followers
        const [followerResults] = await pool.query(sqlSelectFollowers, [userID]);

        // Parse the list of followers and include the user ID
        let followerIDs = followerResults.map(result => result.user_id);
        followerIDs.push(userID);

        // Select posts with user details, likes, and comments
        const [postResults] = await pool.query(sqlSelectPosts, [followerIDs]);

        // Extract user IDs from comments for querying
        const commentUserIds = postResults.flatMap(post => 
            JSON.parse(post.comments || '[]').map(comment => comment.user_id)
        );

        // Fetch user names for comments
        const uniqueUserIds = [...new Set(commentUserIds)];
        let userMap = {};
        if (uniqueUserIds.length > 0) {
            const [userResults] = await pool.query(sqlSelectUsers, [uniqueUserIds]);

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