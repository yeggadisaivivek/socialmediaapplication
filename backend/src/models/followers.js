const db = require('../db');

const updateFollowers = (userID, followerID) => {
    const sqlSelect = `SELECT * FROM followers WHERE user_id = ?`;
    const sqlInsert = `INSERT INTO followers (user_id, list_of_followers) VALUES (?, ?)`;
    const sqlUpdate = `UPDATE followers SET list_of_followers = ? WHERE user_id = ?`;

    return new Promise((resolve, reject) => {
        db.query(sqlSelect, [userID], (selectErr, results) => {
            if (selectErr) {
                return reject({ error: selectErr.message });
            }

            if (results.length === 0) {
                // No followers record exists, create a new one
                const newFollowers = JSON.stringify([followerID]);
                db.query(sqlInsert, [userID, newFollowers], (insertErr, insertResults) => {
                    if (insertErr) {
                        return reject({ error: insertErr.message });
                    }
                    resolve({ message: 'Followers record created successfully', results: insertResults });
                });
            } else {
                // Followers record exists, update it
                let followers = JSON.parse(results[0].list_of_followers || '[]');
                if (!followers.includes(followerID)) {
                    followers.push(followerID);
                    const updatedFollowers = JSON.stringify(followers);
                    db.query(sqlUpdate, [updatedFollowers, userID], (updateErr, updateResults) => {
                        if (updateErr) {
                            return reject({ error: updateErr.message });
                        }
                        resolve({ message: 'Followers updated successfully', results: updateResults });
                    });
                } else {
                    resolve({ message: 'Follower already exists', results });
                }
            }
        });
    });
};

const unfollowFollower = (userID, followerID) => {
    const sqlSelect = `SELECT * FROM followers WHERE user_id = ?`;
    const sqlUpdate = `UPDATE followers SET list_of_followers = ? WHERE user_id = ?`;

    return new Promise((resolve, reject) => {
        db.query(sqlSelect, [userID], (selectErr, results) => {
            if (selectErr) {
                return reject({ error: selectErr.message });
            }

            // Followers record exists, update it
            let followers = JSON.parse(results[0].list_of_followers || '[]');
            if (followers.includes(followerID)) {
                followers = followers.filter(id => id !== followerID);
                const updatedFollowers = JSON.stringify(followers);
                db.query(sqlUpdate, [updatedFollowers, userID], (updateErr, updateResults) => {
                    if (updateErr) {
                        return reject({ error: updateErr.message });
                    }
                    resolve({ message: 'Followers updated successfully', results: updateResults });
                });
            } else {
                resolve({ message: 'Follower already unfollowed', results });
            }
        });
    });
}

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