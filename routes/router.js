const routes = require("express").Router();

const upload = require("./upload");
const getFile = require("./getFile");
const getSignedUrl = require("./getS3buckeckUrl");
routes.get("/", async function (req, res) { 
      res.send(`Api running..!`); 
});
routes.use("/", upload);
routes.use("/", getFile);
routes.use("/", getSignedUrl);
module.exports = routes;