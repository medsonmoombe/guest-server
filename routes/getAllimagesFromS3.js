

// get all the files in the s3 bucket
const aws = require('aws-sdk')
const file = require('express').Router();

const region = process.env.AWS_REGION || 'us-east-1'
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'AKIAWJTKY7P2DZDKFXUD'
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY


const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
    });

async function getAllImagesFromS3() {
    const params = {
        Bucket: bucketName,
        Delimiter: '/',
    };

    const images = await s3.listObjectsV2(params).promise()

    // Function to generate image URLs
function generateImageUrl(key) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }
  
  // Extracting keys from the images response
  const imageKeys = images.Contents.map(image => image.Key);
  
  // Generate image URLs
  const imageUrls = imageKeys.map(key => generateImageUrl(key));
    return imageUrls;
}


// Function to retrieve file from Google Drive

file.get('/allImages', async (req, res) => {
  try {
    const images = await getAllImagesFromS3()
    return res.status(200).json({ images })
  } catch (error) {
    console.error('Error retrieving file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = file;