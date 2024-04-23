const routes = require("express").Router();

const upload = require("./upload");
const getFile = require("./getFile");
const getSignedUrl = require("./getS3buckeckUrl");
const displayUrl = require("./getDisplayUrl");
const getPhotos = require("./getAllimagesFromS3");
const displayImages = require("./getDisplayImages");
const deleteImages = require("./deleteImagesToS3");
const deleteDisplayImages = require("./deleteDisplayImages");
routes.get("/", async function (req, res) { 
      res.send(`Api running..!`); 
});
routes.use("/", upload);
routes.use("/", getFile);
routes.use("/", getSignedUrl);
routes.use("/", getPhotos);
routes.use("/", deleteImages);
routes.use("/", displayImages);
routes.use("/", deleteDisplayImages);
routes.use("/", displayUrl);
module.exports = routes;