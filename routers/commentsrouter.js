const commentsRouter = require('express').Router();
const {getComments} = require('../controllers/commentscon');
const {deleteComment , patchComment} = require('../controllers/commentscon');
const {invalidMeth} = require('../psqlerrorlist')

commentsRouter.route('/').get(getComments).all(invalidMeth);

commentsRouter.route('/:comment_id').delete(deleteComment).patch(patchComment).all(invalidMeth);



module.exports = commentsRouter;