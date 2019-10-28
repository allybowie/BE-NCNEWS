const {selectArticles} = require('../models/articlesmod');

exports.getArticles = (req, res, next) => {
    return selectArticles().then((articles) => {
        res.status(200).send({ articles })
    })
}