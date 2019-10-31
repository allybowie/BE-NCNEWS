const topicsRouter = require('express').Router();
const {getTopics} = require('../controllers/topicscon');
const {invalidMeth} = require('../psqlerrorlist')

topicsRouter.route('/').get(getTopics).all(invalidMeth);


module.exports = topicsRouter;