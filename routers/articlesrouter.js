const articlesRouter = require('express').Router();
const {getArticles , getArticleByID , patchArticle} = require('../controllers/articlescon');
const commentsRouter = require('./commentsrouter')
const {getComments, postComment} = require('../controllers/commentscon')
const {invalidMeth} = require('../psqlerrorlist')

articlesRouter.route('/').get(getArticles).all(invalidMeth);

articlesRouter.route('/:article_id').get(getArticleByID).patch(patchArticle).all(invalidMeth);

articlesRouter.route('/:article_id/comments').get(getComments).post(postComment).all(invalidMeth);

module.exports = articlesRouter;

