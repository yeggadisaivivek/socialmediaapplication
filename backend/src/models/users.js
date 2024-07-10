const db = require('../db');

const getAllUsersWithNames = () => {
    try {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.id, u.username, ud.name
                FROM users u
                LEFT JOIN user_data ud ON u.id = ud.user_id
            `;

            db.query(sql, (err, results) => {
                if (err) {
                    return reject({ error: err.message });
                }

                const usersWithNames = results.map(user => ({
                    id: user.id,
                    username: user.username,
                    name: user.name
                }));

                resolve(usersWithNames);
            });
        });
    } catch (error) {
        return { error: error.message };
    }
};


module.exports = { getAllUsersWithNames }
