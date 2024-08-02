const db = require('../db');
const FOLLOWER_REQUEST_TABLE_NAME = "follower_requests";
const USER_DATA_TABLE_NAME = "user_data"

const getAllFollowerRequestsForUser = async (userId) => {
    const sqlQuery = `
                SELECT ud.name, fr.request_id_from, fr.user_id 
                FROM ${FOLLOWER_REQUEST_TABLE_NAME} fr
                LEFT JOIN ${USER_DATA_TABLE_NAME} ud ON fr.request_id_from = ud.user_id
                WHERE fr.user_id = ? and fr.status_of_request = 'pending'
            `;
    try {
        const [results] = await db.query(sqlQuery, [userId]);
        return { results }
    } catch (error) {
        return { error: error.message };
    }
}

const handleFollowerRequest = async (userID, followerID, action) => {
    const sqlSelectFollowers = `SELECT list_of_followers FROM followers WHERE user_id = ?`;
    const sqlInsertFollowers = `INSERT INTO followers (user_id, list_of_followers) VALUES (?, ?)`;
    const sqlUpdateFollowers = `UPDATE followers SET list_of_followers = ? WHERE user_id = ?`;
    const sqlDeleteRequest = `DELETE FROM follower_requests WHERE user_id = ? AND request_id_from = ?`;

    try {
        if (action === 'accept') {
            const [results] = await db.query(sqlSelectFollowers, [userID]);
            if (!results[0].list_of_followers) {
                // No followers record exists, create a new one
                const newFollowers = JSON.stringify([followerID]);
                await db.query(sqlUpdateFollowers, [newFollowers, userID]);
            } else {
                // Followers record exists, update it
                let followers = JSON.parse(JSON.stringify(results[0].list_of_followers) || '[]');
                if (!followers.includes(followerID)) {
                    followers.push(followerID);
                    const updatedFollowers = JSON.stringify(followers);
                    await db.query(sqlUpdateFollowers, [updatedFollowers, userID]);
                } else {
                    return { message: 'Follower already exists' };
                }
            }
        }

        // Remove the request from the follower_requests table regardless of action
        await db.query(sqlDeleteRequest, [userID, followerID]);

        return { message: `Follower request ${action}ed successfully` };
    } catch (error) {
        return { error: error.message };
    }
};


// Creates a follower request in follower_requests table
const createFollowerRequest = async (userID, followerID) => {
    const sqlInsertRequest = `INSERT INTO follower_requests (user_id, request_id_from) VALUES (?, ?)`;

    try {
        await db.query(sqlInsertRequest, [followerID, userID]);
        return { message: 'Follower request stored successfully' };
    } catch (error) {
        return { error: error.message };
    }
};

const updateStatusOfFollowerRequest = (userID, requestIdFrom, status) => {
    try {
        const sqlUpdate = `UPDATE ${FOLLOWER_REQUEST_TABLE_NAME} SET ? WHERE user_id = ? and request_id_from = ?`;
        const updatedRecord = { status_of_request: status };
        return new Promise((resolve, reject) => {
            db.query(sqlUpdate, [updatedRecord, userID, requestIdFrom], (updateErr, updateResults) => {
                if (updateErr) {
                    return reject({ error: updateErr.message });
                }
                resolve({ message: 'Follower Request updated successfully', results: updateResults });
            });
        })
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = { handleFollowerRequest, getAllFollowerRequestsForUser, createFollowerRequest, updateStatusOfFollowerRequest };