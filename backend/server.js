const express = require('express');
const app = express();
var cors = require('cors')
const port = process.env.PORT || 5000;
const db = require('./db');

app.use(cors());

app.get('/api/message', (req, res) => {
    console.log("entered")
  db.query('SELECT message FROM messages LIMIT 1', (err, results) => {
    if (err) {
        console.log(err)
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: results[0].message });
  });
});

app.get('/test', (req,res) => {
    console.log("in test api")
    res.json({ message: "hello it is working fine"})
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
