const connection = require("../db/connection");

exports.selectArticles = () => {
  return connection('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({comment_count : 'comments.comment_id'})
    .groupBy('articles.article_id')
    .select('articles.*')
}


exports.selectArticleByID = article_id => {
  const id = +article_id  

  return connection('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({comment_count : 'comments.comment_id'})
    .groupBy('articles.article_id')
    .select('articles.*')
    .where('articles.article_id','=',id)
    .then(article => {
      if(!article.length){
        
        return Promise.reject({
          status : 404,
          msg : `Article with ID '${article_id}' does not exist!`
        })
      } else {
        return article[0]
      }
    })
  }

exports.updateArticle = (inputID, votesUpdate) => {
  const id = inputID

  if(!votesUpdate) {
    return Promise.reject({
        status : 400,
        msg : `Invalid request format; please submit 'inc_votes'.`
    })
}

  return connection('articles')
    .increment('votes', votesUpdate)
    .where('articles.article_id', '=', id)
    .then(() => {
    return connection('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({comment_count : 'comments.comment_id'})
    .groupBy('articles.article_id')
    .first('articles.*')
    .where('articles.article_id','=',id)
    .then(article => {
      if(!article){
      return Promise.reject({
        status : 404,
        msg : `Article with ID '${inputID}' does not exist!`
    })
  } else return article
    })
    })
}