

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

    // Function to generate image URLs
    function generateImageUrl(key) {
      return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    }

    // Extracting keys from the images response
    const imageKeys = images.Contents.map(image => image.Key);

    // Sort the image keys
    const sortedImageKeys = imageKeys.sort((a, b) => {
      // Extract date and time from the image key
      const [dateA, timeA] = a?.split('_')[0]?.split('-').concat(a.split('_')[1]?.split('-'));
      const [dateB, timeB] = b?.split('_')[0]?.split('-').concat(b.split('_')[1]?.split('-'));

      // Compare date and time in reverse order to get new uploaded images first
      if (dateA !== dateB) {
        return dateA.localeCompare(dateB); // Sort by date in ascending order
      } else {
        return timeA.localeCompare(timeB); // If dates are the same, sort by time in ascending order
      }
    });

    // Generate image URLs and add them to the result array
    const batchImageUrls = sortedImageKeys.map(key => generateImageUrl(key));
    imageUrls.push(...batchImageUrls);

    // Set ContinuationToken for the next iteration
    continuationToken = images.NextContinuationToken;
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