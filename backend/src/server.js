const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')
const port = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const authMiddleware = require('./middleware/AuthMiddleware')

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes)
app.use('/users', authMiddleware, userRoutes);

app.get('/test', (req,res) => {
    console.log("in test api")
    res.json({ message: "hello it is working fine"})
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
