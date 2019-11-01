const express = require("express");
const apiRouter = require("./routers/apirouter");
const {invalidPath, psqlErrors, normalErrors} = require('./errorhandlers')

const app = express();

console.log("Congratulations, you are in the app");

app.use(express.json());

app.use("/api", apiRouter);

app.all('/*', invalidPath);

app.use(psqlErrors);

app.use(normalErrors);



module.exports = app;