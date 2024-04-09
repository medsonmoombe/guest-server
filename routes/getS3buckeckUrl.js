const aws = require('aws-sdk')
const crypto = require('crypto')
const { promisify } = require('util')
const file = require('express').Router();

const region = 'us-east-1'
const bucketName = 'my-bucket-name'
const accessKeyId = 'AKIAWJTKY7P2DZDKFXUD'
const secretAccessKey = '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'


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

  // Function to retrieve file from Google Drive
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