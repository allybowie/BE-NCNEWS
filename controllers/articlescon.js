const {selectArticles} = require('../models/articlesmod');

exports.getArticles = () => {
    return selectArticles().then((articles) => {
        res.status(200).send({ articles })
    })
}