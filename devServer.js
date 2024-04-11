const app = require("./index");
const routes = require("./routes/router");
const allowCors = fn => async(req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
      return await fn(req, res);
};

app.use("/", allowCors(routes));
app.listen(3001,function () {
      console.log("Server started. Go to http://localhost:3000/");
});