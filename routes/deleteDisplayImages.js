// delete selected image in S3 bucket

const aws = require('aws-sdk')
const file = require('express').Router();

const region = process.env.AWS_REGION || 'us-east-1'
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY



const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
    });


file.delete('/delete-display-images', async (req, res) => {
    const key = req.query.key;
    const params = {
        Bucket: bucketName,
        Delimiter: '/',
        // specify the folder name from s3://wedding-photo-collection/carousel-images/
        Prefix: 'carousel-images/',
        Key: key
    };

    try {
        await s3.deleteObject(params).promise();
        res.status(200).send('Image deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = file;