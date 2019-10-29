const connection = require("../db/connection");

exports.selectArticles = () => {

  const comments = connection
  .select("article_id")
  .from("comments")
  .returning("*");
const articles = connection
  .select("title", "author", "article_id", "topic", "created_at", "votes")
  .from("articles")
  .returning("*");

  const promise = Promise.all([articles, comments]);

  return promise.then(([articles, comments]) => {
    const commentCount = {};

    comments.forEach(comment => {
      commentCount[comment.article_id] =
        (commentCount[comment.article_id] || 0) + 1;
    });

    return articles.map(article => {
      if (commentCount[article.article_id]) {
        article.comment_count = commentCount[article.article_id];
      } else {
        article.comment_count = 0;
      }
      return article;
    });
  });
};


exports.selectArticleByID = article_id => {
  const id = +article_id  

  const comments = connection
  .select("article_id")
  .from("comments")
  .where('article_id', '=', id)
  .returning("*");
  const article = connection
  .first("title", "author", "article_id", "body", "topic", "created_at", "votes")
  .from("articles")
  .where('article_id', '=', id)
  .returning("*")
  

  const promise = Promise.all([article, comments]);

  

  return promise.then(([article, comments]) => {

    if(!article){
      console.log("NO SUCH ARTICLE")
      return Promise.reject({
        status : 404,
        msg : `Article with ID '${article_id}' does not exist!`
      })
    } else {
      article.comment_count = comments.length
      return article
    }
    })
  }