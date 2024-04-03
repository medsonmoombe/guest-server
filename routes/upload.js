const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const upload = require('express').Router();



// OAuth2 credentials
const CLIENT_ID = "582486929557-8h8hpb0ltg0l2b7auj85sdo255opalot.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04sqWc8Z8HUzxCgYIARAAGAQSNwF-L9Irt7T2sT_9Jq4JsjzLh3xyUxsNi2CpZPwnKTJ3GLs89KhYLftRBoCuMD7qnF7gR9Wk-sg";

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
    
    // Function to upload file to Google Drive
    const uploadFile = async (req, res) => {
      try {
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({ message: 'No files were uploaded' });
        }
        
        const uploadedFile = req.files.file;
        
        // Create a temporary directory if it doesn't exist
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }
  
        // Create a temporary file path
      const tempFilePath = path.join(tempDir, uploadedFile.name);
      
      // Write the file stream to the temporary file
      await uploadedFile.mv(tempFilePath);
      
      // Upload file to Google Drive
      const response = await drive.files.create({
        requestBody: {
          name: uploadedFile.name,
        },
        media: {
          mimeType: uploadedFile.mimetype,
          body: fs.createReadStream(tempFilePath),
        },
      });
      
      // Remove the temporary file
      fs.unlinkSync(tempFilePath);
      if(response.data.id) {
        console.log(response.data.id);
        return res.status(200).json({ message: 'File uploaded successfully', fileId: response.data.id });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  upload.post('/upload', uploadFile);
  
    module.exports = upload;