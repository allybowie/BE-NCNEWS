const apiRouter = require("express").Router();
const topicsRouter = require('./topicsrouter');
const articlesRouter = require('./articlesrouter');

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;