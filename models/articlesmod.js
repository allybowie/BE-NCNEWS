const connection = require('../db/connection');

exports.selectArticles = () => {
    const comments = connection.select('article_id').from('comments').returning("*");
    const articles = connection.select('title', 'article_id', 'topic', 'created_at', 'votes').from('articles').returning("*")
    

    const promise = Promise.all([articles , comments])

    return promise
    .then(([articles , comments]) => {
        console.log("articles --->>>",articles)
        console.log("comments --->>>", comments)

        const commentCount = {}

        comments.forEach(comment => {
            commentCount[comment.article_id] = (commentCount[comment.article_id] || 0) + 1;
        })

        articles.forEach(article => {
            if(commentCount[article.article_id]){
            article.comment_count = commentCount[article.article_id]
            } else article.comment_count = 0
        })
    console.log(articles)
    })

}
