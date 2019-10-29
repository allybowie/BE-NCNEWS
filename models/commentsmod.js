const connection = require('../db/connection')

exports.selectComments = (article_id , sort_by = 'created_at' , order = 'desc') => {
    console.log("IN MODEL",sort_by , order)

    return connection.select("comment_id", "votes", "created_at", "author", "body")
    .from('comments')
    .where('article_id', '=', article_id.article_id)
    .orderBy(sort_by, order)
    .then(comments => {
        console.log("THESE ARE COMMENTS",comments)
        if(comments.length===0){
            console.log("WRONG ARTICLE ID")
            return Promise.reject({
                status : 404,
                msg : `Article with ID '${article_id.article_id}' does not exist!`
            })
        } else {
            return comments
        }
    })
}