const topicsRouter = require('express').Router();
const {getTopics} = require('../controllers/topicscon');

topicsRouter.route('/').get(getTopics);


module.exports = topicsRouter;