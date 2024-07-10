const db = require('../db');
const { updateStatusOfFollowerRequest } = require('../models/followerRequests');
const { updateFollowers } = require('../models/followers');

const updateFollowerStatus = async (userID, requestIdFrom, status) => {
    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        // Update follower requests
        const followerRequestResponse = await updateStatusOfFollowerRequest(userID, requestIdFrom, status);
        
        if (status === 'accept') {
            // Update followers
            const followerResponse = await updateFollowers(userID, requestIdFrom);
        }

        await connection.commit();
        return { message: 'Follower status updated successfully' };
    } catch (error) {
        await connection.rollback();
        return { error: error.message };
    } finally {
        connection.release();
    }
};

module.exports = { updateFollowerStatus }