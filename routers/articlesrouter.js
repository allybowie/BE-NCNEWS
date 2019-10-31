const articlesRouter = require('express').Router();
const {getArticles , getArticleByID , patchArticle} = require('../controllers/articlescon');
const commentsRouter = require('./commentsrouter')
const {getComments, postComment} = require('../controllers/commentscon')

articlesRouter.route('/').get(getArticles);

articlesRouter.route('/:article_id').get(getArticleByID).patch(patchArticle);

articlesRouter.route('/:article_id/comments').get(getComments).post(postComment)

module.exports = articlesRouter;

