const commentsRouter = require('express').Router();
const {getComments} = require('../controllers/commentscon');
const {deleteComment} = require('../controllers/commentscon');

commentsRouter.route('/').get(getComments)

commentsRouter.route('/:comment_id').delete(deleteComment)



module.exports = commentsRouter;