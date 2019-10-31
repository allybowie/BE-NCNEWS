const {selectComments , removeComment , updateVotes, addComment} = require('../models/commentsmod')

exports.getComments = (req,res,next) => {
    const {sort_by , order} = req.query
    const article_id = req.params
    return selectComments(article_id , sort_by , order).then(comments=> {
        res.status(200).send({comments})
    }).catch(next)
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    return removeComment(comment_id).then((response) => {
        res.sendStatus(204)
    }).catch(next)
}

exports.patchComment = (req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body
    return updateVotes(comment_id , inc_votes).then(updatedComment => {
        const comment = updatedComment[0]
        res.status(200).send({comment})
    }).catch(next)
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    return addComment(article_id, req.body).then(([comment]) => {
        res.status(201).send({comment})
    })
}