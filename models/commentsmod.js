const connection = require('../db/connection')

exports.selectComments = (article_id , sort_by = 'created_at' , order = 'desc') => {

    return connection.select("comment_id", "votes", "created_at", "author", "body")
    .from('comments')
    .where('article_id', '=', article_id.article_id)
    .orderBy(sort_by, order)
    .then(comments => {
        if(comments.length===0){
            return Promise.reject({
                status : 404,
                msg : `Article with ID '${article_id.article_id}' does not exist!`
            })
        } else {
            return comments
        }
    })
}


exports.removeComment = inputID => {
    let locatedComment = connection.select("comment_id").from('comments').where('comment_id', '=', inputID).returning("*")

    return locatedComment.then(comment => {
        if(comment.length) {
            return connection('comments')
                        .where('comment_id', '=', inputID)
                        .del()
           
        } else { 
            return Promise.reject({
                status : 404,
                msg : `Comment with ID '${inputID}' does not exist!`
            })
        }
            })
}


exports.updateVotes = (inputID, votesUpdate) => {
    let locatedComment = connection.select("*").from('comments').where('comment_id', '=', inputID).returning("*")

    if(!votesUpdate) {
        return Promise.reject({
            status : 400,
            msg : `Invalid request format; please submit 'inc_votes'.`
        })
    }

    return locatedComment.then(comment => {
        if(comment.length){
        return connection('comments')
        .where('comment_id', '=', inputID)
        .increment('votes', votesUpdate)
        .returning("*")
        } else {
            return Promise.reject({
                status : 404,
                msg : `Comment with ID '${inputID}' does not exist!`
            })
        }
    })
    

}