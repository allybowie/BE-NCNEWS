const connection = require('../db/connection')
const { formatDates, formatComments, makeRefObj } = require('../db/utils/utils')

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

    if(!votesUpdate) votesUpdate = 0

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


exports.addComment = (article_id, comment) => {
    if(!comment.created_by || !comment.body){
        return Promise.reject({
            status: 400, msg: "Not enough information. Please input 'body' & 'username'"
        })
    }
    const requiredFields = {body: comment.body, created_by: comment.created_by}
    const articlePromise = connection.select('*').from('articles').where('article_id', '=', article_id).returning("*")
    const newComment = formatDates([requiredFields])
    return articlePromise.then(article => {
        if(article.length===0){
            return Promise.reject({
                status: 400, msg: "This article does not exist"
            })
        }
        commentObj = newComment[0]
        commentObj.belongs_to = article[0].title
        const articleRef = makeRefObj(article)
        const finalComment = formatComments([commentObj], articleRef)
        delete finalComment[0].created_at
        console.log(finalComment)
        return connection('comments').insert(finalComment[0]).returning("*")
    })

}