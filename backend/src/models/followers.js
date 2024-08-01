const db = require('../db');

const updateFollowers = async (userID, followerID) => {
    const sqlSelect = `SELECT list_of_followers FROM followers WHERE user_id = ?`;
    const sqlInsert = `INSERT INTO followers (user_id, list_of_followers) VALUES (?, ?)`;
    const sqlUpdate = `UPDATE followers SET list_of_followers = ? WHERE user_id = ?`;

    try {
        // Fetch current list of followers
        const [results] = await db.query(sqlSelect, [userID]);

        if (results.length === 0) {
            // No followers record exists, create a new one
            const newFollowers = JSON.stringify([followerID]);
            await db.query(sqlInsert, [userID, newFollowers]);
            return { message: 'Followers record created successfully' };
        } else {
            // Followers record exists, update it
            let followers = JSON.parse(results[0].list_of_followers || '[]');
            if (!followers.includes(followerID)) {
                followers.push(followerID);
                const updatedFollowers = JSON.stringify(followers);
                await db.query(sqlUpdate, [updatedFollowers, userID]);
                return { message: 'Followers updated successfully' };
            } else {
                return { message: 'Follower already exists' };
            }
        }
    } catch (error) {
        return { error: error.message };
    }
};


const unfollowFollower = async (userID, followerID) => {
    const sqlSelect = `SELECT list_of_followers FROM followers WHERE user_id = ?`;
    const sqlUpdate = `UPDATE followers SET list_of_followers = ? WHERE user_id = ?`;

    try {
        // Fetch current list of followers
        const [results] = await db.query(sqlSelect, [userID]);
        if (results.length === 0) {
            throw new Error('User not found');
        }

        let followers = JSON.parse(JSON.stringify(results[0].list_of_followers) || '[]');
        if (followers.includes(followerID)) {
            // Remove the follower
            followers = followers.filter(id => id !== followerID);
            const updatedFollowers = JSON.stringify(followers);

            // Update the list of followers
            await db.query(sqlUpdate, [updatedFollowers, userID]);

            return { message: 'Follower unfollowed successfully' };
        } else {
            return { message: 'Follower already unfollowed' };
        }

    } catch (error) {
        return { error: error.message };
    }
};


const getFollowersForUser = async (userID) => {
    const sqlSelectFollowers = `SELECT list_of_followers FROM followers WHERE user_id = ?`;
    const sqlSelectUserData = `SELECT user_id, name FROM user_data WHERE user_id IN (?)`;

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

        if (results.length === 0 || !results[0].list_of_followers) {
            return { message: 'No followers found for this user' };
        }

        // Parse the list of followers
        const followerIDs = JSON.parse(results[0].list_of_followers || '[]');

        if (followerIDs.length === 0) {
            return { message: 'No followers found for this user' };
        }

        // Select the user data for the followers
        const [userDataResults] = await new Promise((resolve, reject) => {
            db.query(sqlSelectUserData, [followerIDs], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        // Map the user data to the required format
        const followersData = userDataResults.map(user => ({
            name: user.name,
            user_id: user.user_id
        }));

        return { followers: followersData };

    } catch (error) {
        return { error: error.message };
    }
};


module.exports = { updateFollowers, unfollowFollower, getFollowersForUser }