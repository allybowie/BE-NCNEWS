const topicsRouter = require('express').Router();
const {getTopics} = require('../controllers/topicscon');
const {invalidMeth} = require('../errorhandlers')

topicsRouter.route('/').get(getTopics).all(invalidMeth);


module.exports = topicsRouter;