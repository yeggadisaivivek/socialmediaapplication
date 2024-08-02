const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const AWS = require('aws-sdk');
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5001;

const authRoutes = require('./routes/authRoutes')
const authMiddleware = require('./middleware/AuthMiddleware')
const userRoutes = require('./routes/userRoutes');
const { deleteAll } = require('./models/users');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes)
app.use('/users', authMiddleware, userRoutes);

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_APP,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_APP,
  region: process.env.AWS_REGION_APP,
});

const s3 = new AWS.S3();

app.get('/generate-presigned-put-url', (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_APP,
    Key: `${Date.now()}_${req.query.filename}`,
    Expires: 60, // URL expiration time in seconds
    ContentType: req.query.contentType,
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ url, key:params.Key });
  });
});

app.get('/test', (req,res) => {
    res.json({ message: "hello it is working fine"})
})

app.delete('/test', async (req, res) => {
  try {
      const response = await deleteAll();
      if (response.error) {
          res.status(500).json({ message: 'Server error', error: response.error });
      } else {
          res.status(200).json({ message: 'Deleted successfully successfully'});
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
