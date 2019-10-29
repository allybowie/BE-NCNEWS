const {selectArticles , selectArticleByID} = require('../models/articlesmod');

exports.getArticles = (req, res, next) => {
    return selectArticles().then((articles) => {
        res.status(200).send({ articles })
    })
}


exports.getArticleByID = (req, res, next) => {
    console.log("IN THE CONTROLLER")
    const {article_id} = req.params;
    console.log(article_id)
    return selectArticleByID(article_id).then(article => {
        res.status(200).send({article})
    }).catch(next)
}