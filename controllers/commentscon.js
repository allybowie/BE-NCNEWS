const {selectComments} = require('../models/commentsmod')

exports.getComments = (req,res,next) => {
    const query = req.query
    console.log(query)
    const article_id = req.params
    return selectComments(article_id , query.sort_by , query.order).then(comments=> {
        console.log(comments)
        res.status(200).send({comments})
    })
}