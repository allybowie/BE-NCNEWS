const {selectArticles , selectArticleByID} = require('../models/articlesmod');

exports.getArticles = (req, res, next) => {
    return selectArticles().then((articles) => {
        res.status(200).send({ articles })
    }).catch(next)
}


exports.getArticleByID = (req, res, next) => {
    const {article_id} = req.params;
    return selectArticleByID(article_id).then(article => {
        res.status(200).send({article})
    }).catch(next)
}