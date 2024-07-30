const db = require('../db');
const { uploadImageToS3Bucket, deleteImageFromS3Bucket, getSignedURLFromS3Bucket } = require('../utils/awsUtil');
const UserDataTableName = "user_data";

const getUsernameByUserId = async (userID) => {
    try {
        const sql = `SELECT * FROM user_data WHERE user_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [userID], (err, results) => {
                if (err) {
                    reject({ error: err.message });
                } else {
                    if(results[0]?.profile_pic_url) {
                        results[0].profile_pic_url = getSignedURLFromS3Bucket(results[0].profile_pic_url)
                    }
                    resolve(results[0]); // Assuming user exists and getting the first result
                }
            });
        });
    } catch (error) {
        return { error: error.message };
    }
}

const getUserDataByUserID = async (userID, followerId) => {
    try {
      // Queries
      const userDataQuery = `SELECT * FROM ${UserDataTableName} WHERE user_id = ?`;
      const postCountQuery = `SELECT COUNT(*) AS number_of_posts FROM posts WHERE user_id = ?`;
      const followerCountQuery = `SELECT SUM(JSON_LENGTH(list_of_followers)) AS number_of_followers FROM followers WHERE user_id = ?`;
      const followerCountQueryWithFollowingStatus = `SELECT JSON_CONTAINS(list_of_followers, JSON_ARRAY(?)) AS isFollower FROM followers WHERE user_id = ?`;
  
      // Execute all queries in parallel
      const [userResults, postCountResults, followerCountResults] = await Promise.all([
        new Promise((resolve, reject) => {
          db.query(userDataQuery, [userID], (err, results) => {
            if (err) {
              reject({ error: err.message });
            } else {
              if (results[0]?.profile_pic_url) {
                results[0].profile_pic_url = getSignedURLFromS3Bucket(results[0].profile_pic_url);
              }
              resolve(results[0]); // Assuming user exists and getting the first result
            }
          });
        }),
        new Promise((resolve, reject) => {
          db.query(postCountQuery, [userID], (err, results) => {
            if (err) {
              reject({ error: err.message });
            } else {
              resolve(results[0]?.number_of_posts);
            }
          });
        }),
        new Promise((resolve, reject) => {
          db.query(followerCountQuery, [userID], (err, results) => {
            if (err) {
              reject({ error: err.message });
            } else {
              if (followerId) {
                db.query(followerCountQueryWithFollowingStatus, [followerId, userID], (err, result) => {
                  if (err) {
                    reject({ error: err.message });
                  } else {
                    results[0].isFollower = result[0].isFollower; // Add following status to results
                    resolve(results[0]);
                  }
                });
              } else {
                resolve(results[0]); // Default to 0 if null
              }
            }
          });
        })
      ]);
  
      // Merge the results
      const mergedResults = {
        ...userResults,
        followingStatus: followerCountResults?.isFollower,
        number_of_posts: postCountResults,
        number_of_followers: followerCountResults?.number_of_followers
      };
  
      return mergedResults;
  
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

const updateUserDataByUserID = (userID, name, bio, profilePicKey) => {
    try {
        // First, retrieve the current profile picture key from the database
        const sqlSelect = `SELECT profile_pic_url FROM user_data WHERE user_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sqlSelect, [userID], async (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }
                if (results.length === 0) {
                    return reject({ error: "User not found" });
                }
                const currentProfilePicKey = results[0]?.profile_pic_url;

                // If a new profile picture is provided, upload it to S3 and delete the old one
                if (profilePicKey) {
                    try {
                        // Delete the old image if it exists
                        if (currentProfilePicKey) {
                            await deleteImageFromS3Bucket(currentProfilePicKey);
                        }
                    } catch (uploadErr) {
                        return reject({ error: uploadErr.message });
                    }
                }

                const updateUserData = {};
                if (name) {
                    updateUserData.name = name;
                }
                if (bio) {
                    updateUserData.bio = bio;
                }
                if (profilePicKey) {
                    updateUserData.profile_pic_url = profilePicKey;
                }
                const sqlUpdate = `UPDATE user_data SET ? WHERE user_id = ?`;
                db.query(sqlUpdate, [updateUserData, userID], (updateErr, updateResults) => {
                    if (updateErr) {
                        return reject({ error: updateErr.message });
                    }
                    resolve({ message: 'Userdata updated successfully', results: updateResults });
                });
            });
        });

    } catch (error) {
        return { error: error.message };
    }
};

const deleteUserDataByUserID = () => {};

module.exports = { getUserDataByUserID, createUserDataByUserID, updateUserDataByUserID, getUsernameByUserId }