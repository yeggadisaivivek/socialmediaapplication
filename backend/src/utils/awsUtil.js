const AWS = require('aws-sdk')

// Configure AWS SDK with your credentials and region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Utility function to upload base64 image to S3
const uploadImageToS3Bucket = (base64Image, folder = 'uploads', fileName = `${Date.now()}.jpg`, contentType = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(base64Image, 'base64');

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${folder}/${fileName}`,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: contentType,
            ACL: 'public-read'
        };

        s3.upload(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.Location);
        });
    });
};

// Utility function to get image from S3
const getImageFromS3Bucket = (key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.Body);
        });
    });
};

const deleteImageFromS3Bucket = (key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        };

        s3.deleteObject(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};


module.exports = { uploadImageToS3Bucket, getImageFromS3Bucket, deleteImageFromS3Bucket }