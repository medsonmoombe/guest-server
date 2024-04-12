

// get all the files in the s3 bucket
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

async function getAllImagesFromS3() {

const imageUrls = [];
  let continuationToken = null;
do {
  const params = {
    Bucket: bucketName,
    Delimiter: '/',
    MaxKeys: 5,
    ContinuationToken: continuationToken
  };

  const images = await s3.listObjectsV2(params).promise();

  const sortedImages = images.Contents.sort((a, b) => {
    const dateA = new Date(a.LastModified);
    const dateB = new Date(b.LastModified);
    return dateB - dateA;
  });

  // Function to generate image URLs
  function generateImageUrl(key) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }

  // Extracting keys from the images response
  const imageKeys = sortedImages.Contents.map(image => image.Key);

  // Generate image URLs and add them to the result array
  const batchImageUrls = imageKeys.map(key => generateImageUrl(key));
  imageUrls.push(...batchImageUrls);

  // Set ContinuationToken for the next iteration
  continuationToken = sortedImages.NextContinuationToken;

} while (continuationToken);
    return imageUrls;
}


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