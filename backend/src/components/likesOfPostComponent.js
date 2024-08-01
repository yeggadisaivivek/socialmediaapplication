const pool = require('../db');
const LIKES_OF_POST_TABLE_NAME = 'likes_of_post';
const USER_DATA_TABLE_NAME = 'user_data';

const getUsersWhoLikedPost = async (postId) => {
    const sqlSelectLikes = `SELECT liked_by_users FROM ${LIKES_OF_POST_TABLE_NAME} WHERE post_id = ?`;
    const sqlSelectUserData = `SELECT user_id, name FROM ${USER_DATA_TABLE_NAME} WHERE user_id IN (?)`;

    try {
        // Select the list of users who liked the post
        const [likesResults] = await new Promise((resolve, reject) => {
            db.query(sqlSelectLikes, [postId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        if (likesResults.length === 0 || !likesResults[0].liked_by_users) {
            return { message: 'No likes found for this post' };
        }

        // Parse the list of liked_by_users
        const likedByUsers = JSON.parse(likesResults[0].liked_by_users || '[]');

        if (likedByUsers.length === 0) {
            return { message: 'No likes found for this post' };
        }

        // Select the user data for the users who liked the post
        const [userDataResults] = await new Promise((resolve, reject) => {
            db.query(sqlSelectUserData, [likedByUsers], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        // Map the user data to the required format
        const usersData = userDataResults.map(user => ({
            name: user.name,
            user_id: user.user_id
        }));

        return { users: usersData };

    } catch (error) {
        return { error: error.message };
    }
};

const likeOrUnlikePost = async (userId, postId, action) => {
    const connection = pool;

    try {
        const sqlSelectLikes = `SELECT liked_by_users FROM likes_of_post WHERE post_id = ?`;
        const sqlUpdateLikes = `UPDATE likes_of_post SET liked_by_users = ? WHERE post_id = ?`;
        const sqlUpdatePost = `UPDATE posts SET likes_count = ? WHERE id = ?`;

        // Fetch current likes data
        const [likesResult] = await connection.query(sqlSelectLikes, [postId]);
        if (likesResult.length === 0) {
            throw new Error('Post not found');
        }
        let likedByUsers = JSON.parse(JSON.stringify(likesResult[0].liked_by_users) || '[]');

        if (action === 'like') {
            if (!likedByUsers.includes(userId)) {
                likedByUsers.push(userId);
            } else {
                return { message: 'Liked' };
            }
        } else if (action === 'unlike') {
            if (likedByUsers.includes(userId)) {
                likedByUsers = likedByUsers.filter(id => id !== userId);
            } else {
                return { message: 'Unliked' };
            }
        } else {
            throw new Error('Invalid action');
        }

        const likesCount = likedByUsers.length;

        // Update likes_of_post table
        await connection.query(sqlUpdateLikes, [JSON.stringify(likedByUsers), postId]);

        // Update posts table
        await connection.query(sqlUpdatePost, [likesCount, postId]);

        return { message: 'Post liked/unliked successfully' };

    } catch (error) {
        return { error: error.message };
    }
};

module.exports = { getUsersWhoLikedPost, likeOrUnlikePost };
