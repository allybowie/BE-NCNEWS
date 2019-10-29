const commentsRouter = require('express').Router();
const {getComments} = require('../controllers/commentscon');

commentsRouter.route('/').get(getComments)



module.exports = commentsRouter;