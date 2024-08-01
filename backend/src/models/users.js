const db = require('../db');

const getAllUsersWithNames = async () => {
    const sql = `
        SELECT u.id, u.username, ud.name
        FROM users u
        LEFT JOIN user_data ud ON u.id = ud.user_id
    `;

    try {
        // Execute query and get results
        const [results] = await db.query(sql);

        // Map results to desired structure
        const usersWithNames = results.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name
        }));

        return usersWithNames;
    } catch (error) {
        return { error: error.message };
    }
};



module.exports = { getAllUsersWithNames }
