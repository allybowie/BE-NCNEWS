const commentsRouter = require('express').Router();
const {getComments} = require('../controllers/commentscon');
const {deleteComment , patchComment} = require('../controllers/commentscon');

commentsRouter.route('/').get(getComments)

commentsRouter.route('/:comment_id').delete(deleteComment).patch(patchComment);



module.exports = commentsRouter;