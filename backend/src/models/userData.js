const db = require('../db');
const { uploadImageToS3Bucket, deleteImageFromS3Bucket } = require('../utils/awsUtil');
const UserDataTableName = "user_data";

const getUserDataByUserID = (userID) => {
    try {
        const sql = `SELECT * FROM ${UserDataTableName} WHERE user_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [userID], (err, results) => {
                if (err) {
                    reject({ error: err.message });
                } else if (results.length === 0) {
                    resolve({ error: "UserData not found" });
                } else {
                    resolve(results[0]);
                }
            });
        });
    } catch (error) {
        return { error: error.message };
    }
};

const createUserDataByUserID = ( userID, name, bio, profilePicBase64Encoded ) => {
    try {
        // TODO call awsUpload to upload the image to get the profilepic Url
        const profilePicUrl = uploadImageToS3Bucket(profilePicBase64Encoded);

        const newUserData = {
            user_id: userID,
            name,
            bio,
            profilePicUrl
        }
        const sql = `INSERT INTO user_data SET ?`;
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
}

const updateUserDataByUserID = (userID, name, bio, profilePicBase64Encoded) => {
    try {
        // First, retrieve the current profile picture key from the database
        const sqlSelect = `SELECT profile_pic_key FROM user_data WHERE user_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sqlSelect, [userID], async (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                if (results.length === 0) {
                    return reject({ error: "User not found" });
                }

                const currentProfilePicKey = results[0].profile_pic_url;
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

                const updateUserData = {
                    name,
                    bio,
                    profile_pic_key: profilePicKey
                };

                const sqlUpdate = `UPDATE user_data SET ? WHERE user_id = ?`;
                db.query(sqlUpdate, [updateUserData, userID], (updateErr, updateResults) => {
                    if (updateErr) {
                        return reject({ error: updateErr.message });
                    }
                    resolve({ message: 'User data updated successfully', results: updateResults });
                });
            });
        });

    } catch (error) {
        return { error: error.message };
    }
};

const deleteUserDataByUserID = () => {};

module.exports = { getUserDataByUserID, createUserDataByUserID, updateUserDataByUserID }