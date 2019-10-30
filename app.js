const express = require("express");
const apiRouter = require("./routers/apirouter");
const errRef = require('./psqlerrorlist')

const app = express();

console.log("Congratulations, you are in the app");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if(err.code){
    console.log(err.code)
   res.status(errRef[err.code].code).send({msg: errRef[err.code].message})
  } else (next(err))
})

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});



module.exports = app;