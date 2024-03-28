const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const file = require('express').Router();



// OAuth2 credentials
const CLIENT_ID = "582486929557-8h8hpb0ltg0l2b7auj85sdo255opalot.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//0477-c7t0kmkmCgYIARAAGAQSNwF-L9IrTscUpA0VAAJXJUyCcv1wtR05kRMNRItCeYHdZvCOGL2_HiSFxDPUQxgq697E__ztNds";

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
  );
  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
  });
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  
  
  const getFile = async (req, res) => {
    try {
      // Get file ID from request query parameter
      const fileId = req.query.fileId;
      if (!fileId) {
        return res.status(400).json({ message: 'File ID is required' });
      }
  
      // Download file from Google Drive
      const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
      
      // Pipe file stream to response
      response.data.pipe(res);
    } catch (error) {
      console.error('Error retrieving file:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Function to retrieve file from Google Drive
  file.get('/file', getFile);
  
  module.exports = file;