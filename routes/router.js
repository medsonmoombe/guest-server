const routes = require("express").Router();

const upload = require("./upload");
const getFile = require("./getFile");
const getSignedUrl = require("./getS3buckeckUrl");
const getPhotos = require("./getAllimagesFromS3");
routes.get("/", async function (req, res) { 
      res.send(`Api running..!`); 
});
routes.use("/", upload);
routes.use("/", getFile);
routes.use("/", getSignedUrl);
routes.use("/", getPhotos);
module.exports = routes;