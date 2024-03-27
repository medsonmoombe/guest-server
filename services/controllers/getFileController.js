const { google } = require('googleapis');

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});
const drive = google.drive({ version: "v3", auth: oauth2Client });

// Function to retrieve file from Google Drive
const getFile = async (req, res) => {
  try {
    // Get file ID from request query parameter
    const fileId = req.query.fileId;
    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }
    // Download file from Google Drive
    const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
    response.data.pipe(res);
  } catch (error) {
    console.error('Error retrieving file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getFile };
