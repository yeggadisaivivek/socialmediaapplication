const mysql = require('mysql2');
const config = require('./config');

const connectionConfig = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
};

const connectWithRetry = (retries = 5) => {
  const connection = mysql.createConnection(connectionConfig);

  connection.connect(err => {
    if (err) {
      if (retries > 0) {
        console.log(`Error connecting to the database: ${err.message}. Retrying in 5 seconds...`);
        setTimeout(() => connectWithRetry(retries - 1), 5000);
      } else {
        console.error('Could not connect to the database. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('Connected to the database');
    }
  });

  return connection;
};

const connection = connectWithRetry();

module.exports = connection;
