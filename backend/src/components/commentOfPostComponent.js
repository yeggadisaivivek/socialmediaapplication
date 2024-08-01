const db = require('../db');

const getCommentsByPostId = async (postId) => {
    const sqlSelectComments = `SELECT comments FROM comments_of_post WHERE post_id = ?`;
    const sqlSelectUserDetails = `SELECT user_id, name FROM user_data WHERE user_id IN (?)`;

    try {
        // Retrieve comments JSON from comments_of_post table
        const commentsResult = await new Promise((resolve, reject) => {
            db.query(sqlSelectComments, [postId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return resolve({ comments: [] });
                }
                resolve(results[0]);
            });
        });

        const comments = JSON.parse(commentsResult.comments || '[]');
        const userIds = comments.map(comment => comment.user_id);

        if (userIds.length === 0) {
            return { comments: [] };
        }

        // Retrieve user details for the given user IDs
        const usersResult = await new Promise((resolve, reject) => {
            db.query(sqlSelectUserDetails, [userIds], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        // Merge comments with user details
        const commentsWithUserDetails = comments.map(comment => {
            const user = usersResult.find(user => user.user_id === comment.user_id);
            return {
                user_id: comment.user_id,
                comment: comment.comment,
                name: user ? user.name : null
            };
        });

        return { comments: commentsWithUserDetails };

    } catch (error) {
        return { error: error.message };
    }
};

const addCommentToPost = async (postId, userId, comment) => {
    const sqlSelect = `SELECT comments FROM comments_of_post WHERE post_id = ?`;
    const sqlInsert = `INSERT INTO comments_of_post (post_id, comments) VALUES (?, ?)`;
    const sqlUpdate = `UPDATE comments_of_post SET comments = ? WHERE post_id = ?`;

    try {
        // Retrieve current comments from the comments_of_post table
        const [commentsResult] = await db.query(sqlSelect, [postId]);

        let comments = [];
        if (commentsResult.length > 0) {
            comments = JSON.parse(JSON.stringify(commentsResult[0].comments) || '[]');
        }

        // Add the new comment
        const newComment = { user_id: userId, comment };
        comments.push(newComment);

        const updatedComments = JSON.stringify(comments);

        // Insert or update the comments
        if (commentsResult.length === 0) {
            await db.query(sqlInsert, [postId, updatedComments]);
        } else {
            await db.query(sqlUpdate, [updatedComments, postId]);
        }

        return { comment: newComment };

    } catch (error) {
        return { error: error.message };
    }
};


module.exports = { getCommentsByPostId, addCommentToPost };
