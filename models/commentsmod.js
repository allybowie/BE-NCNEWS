const connection = require('../db/connection')

exports.selectComments = (article_id , sort_by = 'created_at' , order = 'desc') => {
    // console.log(query)

    return connection.select("comment_id", "votes", "created_at", "author", "body")
    .from('comments')
    .where('article_id', '=', article_id.article_id)
    .orderBy(sort_by, order)
    .then(comments => {
        if(!comments){
            console.log("WRONG ARTICLE ID")
            return Promise.reject({
                status : 404,
                msg : `Article with ID '${article_id}' does not exist!`
            })
        } else {
            return comments
        }
    })
}