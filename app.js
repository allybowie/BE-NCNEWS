const express = require("express");
const apiRouter = require("./routers/apirouter")

const app = express();

console.log("Congratulations, you are in the app");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});


module.exports = app;