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


exports.removeComment = comment_id => {
    return connection('comments')
            .where('comment_id', '=' , comment_id)
            .del()
}