const routes = require("express").Router();

const upload = require("./upload");
const getFile = require("./getFile");
routes.get("/", async function (req, res) { 
      res.send(`Api running..!`); 
});
routes.use("/", upload);
routes.use("/", getFile);
module.exports = routes;