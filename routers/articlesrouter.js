const articlesRouter = require('express').Router();
const {getArticles} = require('../controllers/articlescon');

articlesRouter.route('/').get(getArticles);

module.exports = articlesRouter;

