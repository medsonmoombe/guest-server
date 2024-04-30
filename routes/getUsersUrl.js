const aws = require('aws-sdk')
const crypto = require('crypto')
const { promisify } = require('util')
const file = require('express').Router();

const region ='us-east-1'
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY


const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
    });

async function getS3buckeckUrl() {
  const randomBytes = promisify(crypto.randomBytes);
    
  // Generate a random string
  const randomString = (await randomBytes(5)).toString('hex');
  
  // Get the current date and time in the required format
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;

  // Combine date, time, and random string to form the imageName
  const imageName = `${formattedDate}_${formattedTime}_${randomString}`;

    const params = {
        Bucket: bucketName,
        Key: 'users-image-uploads/' + imageName,
        Expires: 60
    }

    const url = await s3.getSignedUrlPromise('putObject', params)
    return url;
}

  file.get('/users-uploads-url', async (req, res) => {
    try {
      const url = await getS3buckeckUrl()
      return res.status(200).json({ url })
    } catch (error) {
      console.error('Error retrieving file:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = file;