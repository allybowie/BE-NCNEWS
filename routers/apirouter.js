const apiRouter = require("express").Router();
const topicsRouter = require('./topicsrouter');
const articlesRouter = require('./articlesrouter');
const usersRouter = require('./usersrouter');
const commentsRouter = require('./commentsrouter');

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users" , usersRouter);

apiRouter.use('/comments', commentsRouter);


module.exports = apiRouter;