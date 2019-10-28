const apiRouter = require("express").Router();
const topicsRouter = require('./topicsrouter')

apiRouter.use("/topics", topicsRouter)

module.exports = apiRouter;