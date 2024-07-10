const db = require('../db');
const FOLLOWER_REQUEST_TABLE_NAME = "follower_requests";
const USER_DATA_TABLE_NAME = "user_data"

const getAllFollowerRequestsForUser = (userId) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT ud.name, fr.request_id_from, fr.user_id 
                FROM ${FOLLOWER_REQUEST_TABLE_NAME} fr
                LEFT JOIN ${USER_DATA_TABLE_NAME} ud ON fr.request_id_from = ud.user_id
                WHERE fr.user_id = ? and fr.status_of_request = 'pending'
            `;
            db.query(sql, [userId], (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                resolve(results);
            });
        });
    } catch (error) {
        return { error: error.message };
    }
}

// Creates a follower request in follower_requests table
const createFollowerRequest = (userID, requestIdFrom) => {
    try {
        const newUserData = {
            user_id: userID,
            request_id_from: requestIdFrom,
        }
        const sql = `INSERT INTO ${FOLLOWER_REQUEST_TABLE_NAME} SET ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, newUserData, (err, results) => {
                if (err) {
                    reject({ error: err.message });
                }
            });
        });

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

module.exports = { getAllFollowerRequestsForUser, createFollowerRequest, updateStatusOfFollowerRequest };