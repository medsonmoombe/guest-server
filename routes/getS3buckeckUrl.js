const aws = require('aws-sdk')
const crypto = require('crypto')
const { promisify } = require('util')
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

async function getS3buckeckUrl() {
    const randomBytes = promisify(crypto.randomBytes)
    const imageName = `${(await randomBytes(16)).toString('hex')}`
    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    }

    const url = await s3.getSignedUrlPromise('putObject', params)
    return url;
}

  file.get('/s3Url', async (req, res) => {
    try {
      const url = await getS3buckeckUrl()
      console.log('URL:', url)
      return res.status(200).json({ url })
    } catch (error) {
      console.error('Error retrieving file:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = file;