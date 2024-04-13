

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
      MaxKeys: 500,
      ContinuationToken: continuationToken
    };

    const images = await s3.listObjectsV2(params).promise();

    // Function to generate image URLs
    function generateImageUrl(key) {
      return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    }

    // Extracting keys from the images response
    const imageKeys = images.Contents.map(image => image.Key);


    const sortedImageKeys = imageKeys.sort((a, b) => {
      // Extract date and time from the image key
      const [dateA, timeA] = a.split('_').slice(0, 2);
      const [dateB, timeB] = b.split('_').slice(0, 2);
  
      // Parse date and time strings into Date objects
      const dateTimeA = new Date(`${dateA}T${timeA}`);
      const dateTimeB = new Date(`${dateB}T${timeB}`);
  
      // Compare Date objects
      return dateTimeB - dateTimeA; // Sort by most recent first
  });

    // Generate image URLs and add them to the result array
    const batchImageUrls = sortedImageKeys.map(key => generateImageUrl(key));
    imageUrls.push(...batchImageUrls)

    // Set ContinuationToken for the next iteration
    continuationToken = images.NextContinuationToken;
  } while (continuationToken);
  console.log("REVERSED", imageUrls.reverse())
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