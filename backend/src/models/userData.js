const pool = require('../db');
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
    const userDataQuery = `SELECT * FROM ${UserDataTableName} WHERE user_id = ?`;
    const postCountQuery = `SELECT COUNT(*) AS number_of_posts FROM posts WHERE user_id = ?`;
    const followerCountQuery = `SELECT SUM(JSON_LENGTH(list_of_followers)) AS number_of_followers FROM followers WHERE user_id = ?`;
    const followerStatusQuery = `SELECT JSON_CONTAINS(list_of_followers, JSON_ARRAY(?)) AS isFollower FROM followers WHERE user_id = ?`;
    const followerRequestQuery = `SELECT COUNT(*) AS isRequested FROM follower_requests WHERE user_id = ? AND request_id_from = ?`;
  
    try {
        // Execute all queries in parallel
        const [userResults, postCountResults, followerCountResults, followingStatus] = await Promise.all([
            // Fetch user data and process the profile picture URL
            (async () => {
                const [results] = await pool.query(userDataQuery, [userID]);
                if (results.length > 0 && results[0].profile_pic_url) {
                    results[0].profile_pic_url = await getSignedURLFromS3Bucket(results[0].profile_pic_url);
                }
                return results[0] || {}; // Return an empty object if no results
            })(),
  
            // Fetch post count
            (async () => {
                const [results] = await pool.query(postCountQuery, [userID]);
                return results[0]?.number_of_posts || 0;
            })(),
  
            // Fetch follower count
            (async () => {
                const [results] = await pool.query(followerCountQuery, [userID]);
                return results[0]?.number_of_followers || 0;
            })(),
  
            // Fetch following status
            (async () => {
                if (followerId) {
                    const [[followerStatusResults], [followerRequestResults]] = await Promise.all([
                        pool.query(followerStatusQuery, [userID, followerId]),
                        pool.query(followerRequestQuery, [followerId, userID])
                    ]);
                    if (followerStatusResults[0]?.isFollower) {
                        return 'follower';
                    } else if (followerRequestResults[0]?.isRequested) {
                        return 'requested';
                    }
                }
                return 'not a follower';
            })()
        ]);
  
        // Merge the results
        const mergedResults = {
            ...userResults,
            followingStatus,
            number_of_posts: postCountResults,
            number_of_followers: Number(followerCountResults)
        };
  
        return mergedResults;
  
    } catch (error) {
        return { error: error.message };
    }
  };
  

  

const createUserDataByUserID = async (userID, name, bio, profilePicBase64Encoded) => {
  try {
      // Upload the image to S3
      const profilePicUrl = await uploadImageToS3Bucket(profilePicBase64Encoded);

      // Prepare the new user data
      const newUserData = {
          user_id: userID,
          name,
          bio,
          profile_pic_url: profilePicUrl
      };

      // Insert new user data
      const sql = `INSERT INTO user_data SET ?`;
      const [result] = await pool.query(sql, newUserData);

      return { message: "User data created successfully", result };

  } catch (error) {
      return { error: error.message };
  }
};

const updateUserDataByUserID = async (userID, name, bio, profilePicBase64Encoded) => {
  const sqlSelect = `SELECT profile_pic_url FROM user_data WHERE user_id = ?`;

  try {
      // Retrieve the current profile picture URL
      const [results] = await pool.query(sqlSelect, [userID]);
      if (results.length === 0) {
          return { error: "User not found" };
      }
      
      const currentProfilePicUrl = results[0]?.profile_pic_url;

      // Prepare updated user data
      const updateUserData = {};
      if (name) updateUserData.name = name;
      if (bio) updateUserData.bio = bio;

      // Handle profile picture update
      if (profilePicBase64Encoded) {
          // Upload new image to S3
          await uploadImageToS3Bucket(profilePicBase64Encoded);
          updateUserData.profile_pic_url = profilePicBase64Encoded;

          // Delete the old image if it exists
          if (currentProfilePicUrl) {
              try {
                  await deleteImageFromS3Bucket(currentProfilePicUrl);
              } catch (uploadErr) {
                  return { error: uploadErr.message };
              }
          }
      }

      // Update user data in the database
      const sqlUpdate = `UPDATE user_data SET ? WHERE user_id = ?`;
      const [updateResult] = await pool.query(sqlUpdate, [updateUserData, userID]);

      return { message: "User data updated successfully", result: updateResult };

  } catch (error) {
      return { error: error.message };
  }
};


const deleteUserDataByUserID = () => {};

module.exports = { getUserDataByUserID, createUserDataByUserID, updateUserDataByUserID, getUsernameByUserId }