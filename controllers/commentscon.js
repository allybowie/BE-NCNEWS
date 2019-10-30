const {selectComments , removeComment} = require('../models/commentsmod')

exports.getComments = (req,res,next) => {
    const {sort_by , order} = req.query
    const article_id = req.params
    return selectComments(article_id , sort_by , order).then(comments=> {
        res.status(200).send({comments})
    }).catch(next)
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    return removeComment(comment_id).then(response => {
        res.sendStatus(204)
    })
}