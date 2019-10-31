process.env.NODE_ENV = "test";
const app = require("../app");
const chai = require("chai");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const request = require("supertest");
const connection = require("../db/connection");
chai.use(require("chai-sorted"));

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => connection.destroy());


  //GET Api
  describe('/api', () => {
    it('GET: 200 - returns a JSON', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body: {endpoints}}) => {
        expect(endpoints).to.be.an("object")
      })
    });
    it('GET: 200 - returns the required information', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body: {endpoints}}) => {
        expect(endpoints).to.be.an("object")
      })
    });
  });


  //GET Topics
  describe("/topics", () => {
    it("GET: 200 - returns an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
        });
    });
    it("GET: 200 - returns an array with the correct amount of elements", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).to.equal(3);
        });
    });
    it("GET: 200 - returns an array of all topics with correct keys", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach(topic => {
            expect(topic).to.have.keys(["slug", "description"]);
          });
        });
    });
  });

  //GET Articles
  describe.only("/articles", () => {
    it("GET: 200 - returns an array of all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("array");
          expect(articles.length).to.equal(12);
          const testArticle = articles.find(element => {
            return element.article_id === 1
          })
          expect(testArticle.comment_count).to.equal('13')
          articles.forEach(article => {
            expect(article).to.have.keys([
              "title",
              "article_id",
              "author",
              "topic",
              "body",
              "created_at",
              "votes",
              "comment_count"
            ]);
          });
        });
    });
    it("GET: 200 - returns an array of the correct amount of elements", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(12);
        });
    });
    it("GET: 200 - returns an array of all articles with correct keys", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach(article => {
            expect(article).to.have.keys([
              "title",
              "article_id",
              "author",
              "topic",
              "body",
              "created_at",
              "votes",
              "comment_count"
            ]);
          });
        });
    });
    it("GET: 200 - returns an array of all articles with correct comment counts", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          const testArticle = articles.find(element => {
            return element.article_id === 1
          })
          expect(testArticle.comment_count).to.equal('13')
        });
    });
    it("GET: 200 - returns an array of all articles with correct comment counts ordered by dates, descending as default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          const firstArticle = articles[0]
          const lastArticle = articles[11]
          expect(firstArticle.article_id).to.equal(1)
          expect(lastArticle.article_id).to.equal(12)
        });
    });
    it("GET: 200 - returns an array of all articles with correct comment counts, that also match an ordered query (dates, ascending)", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          const firstArticle = articles[0]
          const lastArticle = articles[11]
          expect(firstArticle.article_id).to.equal(12)
          expect(lastArticle.article_id).to.equal(1)
        });
    });
    it("GET: 200 - returns an array of correct length with correct comment counts depending on a author query", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(3)
        });
    });
    it("GET: 200 - returns an array of correct length with correct comment counts depending on an author query", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach(article => {
            expect(article.author).to.equal("butter_bridge")
          })
        });
    });
    it("GET: 200 - returns an array of correct length with correct comment counts depending on a topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(11)
        });
    });
    it("GET: 200 - returns an array of correct length with correct comment counts depending on an topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach(article => {
            expect(article.topic).to.equal("mitch")
          })
        });
    });
    it("GET: 200 - returns an array of correct length with correct comment counts depending on a topic & author query", () => {
      return request(app)
        .get("/api/articles?topic=mitch&&author=rogersop")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(2)
        });
    });
    it("GET: 200 - returns an array of correct length with correct comment counts depending on an topic & author query", () => {
      return request(app)
        .get("/api/articles?topic=mitch&&author=rogersop")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach(article => {
            expect(article.topic).to.equal("mitch")
            expect(article.author).to.equal("rogersop")
          })
        });
    });
    it("GET: 200 - returns an array of correct length and order with correct comment counts depending on an topic  & author query", () => {
      return request(app)
        .get("/api/articles?topic=mitch&&author=rogersop&&sort_by=article_id&&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          const firstArticle = articles[0]
          const lastArticle = articles[1]
          articles.forEach(article => {
            expect(article.topic).to.equal("mitch")
            expect(article.author).to.equal("rogersop")
          })
          expect(firstArticle.article_id<lastArticle.article_id).to.equal(true)
        });
    });
    it("GET: 400 - returns a 400 error if the queried author is not found", () => {
      return request(app)
        .get("/api/articles?author=wrong")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("The author you have requested does not exist")
        });
    });
    it("GET: 404 - returns a 404 error if no articles by the queried author are found", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.eql([])
        });
    });
    it("GET: 400 - returns a 400 error if the queried topic is not found", () => {
      return request(app)
        .get("/api/articles?topic=wrong")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("This category does not exist")
        });
    });
    it("GET: 400 - returns a 404 error if the queried topic is not found", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.eql([])
        });
    });
    it("GET: 400 - returns a 400 error when an invalid sort_by category is given", () => {
      return request(app)
        .get("/api/articles?sort_by=date")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("We cannot sort the articles in the way you have requested. Please try again")
        });
    });
    it("GET: 400 - returns a 400 error when an invalid sort order is given", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&&order=upwards")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("We cannot sort the articles in the way you have requested. Please try again")
        });
    });
  });

  //GET Article by ID
  describe("/api/articles/:article_id", () => {
    it("GET: 200 - returns an individual object", () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an("object");
        });
    });
    it("GET: 200 - returns an individual object with the correct article keys", () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count' );
        });
    });
    it("GET: 200 - returns an individual article object with the correct comment_count value", () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).to.equal('13')
        });
    });
    it('GET: 404 - returns an error when given an article ID that does not exist', () => {
      return request(app)
        .get('/api/articles/29')
        .expect(404)
        .then(({body: { msg }}) => {
          expect(msg).to.equal("Article with ID '29' does not exist!")
        })
    });
    it('GET: 400 - returns an error when given an invalid article ID', () => {
      return request(app)
        .get('/api/articles/jimmyhavoc')
        .expect(400)
        .then(({body: { msg }}) => {
          expect(msg).to.equal('Invalid input type - Text')
        })
    });
  })


  //PATCH Article by ID
  describe('/api/articles/:articleID', () => {
    it('PATCH: 200 - updates the vote count on an article and responds with the full, updated article', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes : 1
      })
      .expect(200)
      .then(({ body : { article } }) => {
        expect(article).to.be.an("object")
      })
    });
    it('PATCH: 200 - returns an updated article object with the correct keys', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes : 1
      })
      .expect(200)
      .then(({ body : { article } }) => {
        expect(article).to.have.keys("article_id", "author", "title", "body", "created_at", "topic", "comment_count", "votes")
        expect(article.votes).to.equal(101)
      })
    });
    it('PATCH: 200 - returns an updated article object with the correct votes value (increasing)', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes : 1
      })
      .expect(200)
      .then(({ body : { article } }) => {
        expect(article.votes).to.equal(101)
      })
    });
    it('PATCH: 200 - returns an updated article object with the correct votes value (decreasing)', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes : -1
      })
      .expect(200)
      .then(({ body : { article } }) => {
        expect(article.votes).to.equal(99)
      })
    });
        it("PATCH: 200 - returns an unedited article if no valid patch keys are present in the request", () => {
          return request(app)
          .patch('/api/articles/1')
          .send({
            vote : 1
          })
          .expect(200)
          .then(({ body : {article}}) => {
            expect(article.votes).to.equal(100)
          })
        })
    it("PATCH: 404 - returns a 404 error when attempting to update an article that doesn't exist", () => {
      return request(app)
      .patch('/api/articles/20')
      .send({
        inc_votes : 1
      })
      .expect(404)
      .then(({ body : {msg}}) => {
        expect(msg).to.equal("Article with ID '20' does not exist!")
      })
    })
    it("PATCH: 400 - returns a 400 error when attempting to update an invalid data-type (ie. Article ID is text", () => {
      return request(app)
      .patch('/api/articles/thisarticle')
      .send({
        inc_votes : 1
      })
      .expect(400)
      .then(({ body : {msg}}) => {
        expect(msg).to.equal("Invalid input type - Text")
      })
    })
    it("PATCH: 400 - returns a 400 error when attempting to update a valid ID with an invalid patch value (ie. string", () => {
      return request(app)
      .patch('/api/articles/2')
      .send({
        inc_votes : "One"
      })
      .expect(400)
      .then(({ body : {msg}}) => {
        expect(msg).to.equal("Invalid input type - Text")
      })
    })
  });

  //POST Comment by Article_ID
  describe('/api/articles/:article_id/comments', () => {
    it('POST 201: posts a new comment', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      username: 'butter_bridge'
    })
      .expect(201)
      .then(({body : {comment}}) => {
        expect(comment).to.be.an("object")
      })
    });
    it('POST 201: returns a comment with the correct keys', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      username: 'butter_bridge'
    })
      .expect(201)
      .then(({body : {comment}}) => {
        expect(comment).to.have.keys(['article_id', 'body', 'created_at', 'comment_id', 'author', 'votes'])
      })
    });
    it('POST 201: returns a specifically filled out comment body', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      username: 'butter_bridge'
    })
      .expect(201)
      .then(({body : {comment}}) => {
        expect(comment).to.have.keys(['article_id', 'body', 'created_at', 'comment_id', 'author', 'votes'])
        expect(comment.comment_id).to.eql(19)
        expect(comment.article_id).to.equal(1)
        expect(comment.body).to.equal('WHAT A WONDERFUL COMMENT THIS IS')
        expect(comment.author).to.equal('butter_bridge')
        expect(comment.votes).to.equal(0)
      })
    });
    it('POST 201: ignores invalid/unneccesary fields', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      username: 'butter_bridge',
      favourite_wrestler: "Orange Cassidy" 
    })
      .expect(201)
      .then(({body : {comment}}) => {
        expect(comment).to.have.keys(['article_id', 'body', 'created_at', 'comment_id', 'author', 'votes'])
        expect(comment.comment_id).to.eql(19)
        expect(comment.article_id).to.equal(1)
        expect(comment.body).to.equal('WHAT A WONDERFUL COMMENT THIS IS')
        expect(comment.author).to.equal('butter_bridge')
        expect(comment.votes).to.equal(0)
      })
    });
    it('POST 400: gives a 400 error when an article that does not exist', () => {
      return request(app)
      .post('/api/articles/20/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      username: 'butter_bridge', 
    })
      .expect(404)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("This article does not exist")
      })
    });
    it('POST 400: gives a 400 error when an article that does not exist with an incorrect username', () => {
      return request(app)
      .post('/api/articles/20/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      username: 'wrong', 
    })
      .expect(404)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("This user does not have an account")
      })
    });
    it('POST 400: gives a 400 error when an invalid article id', () => {
      return request(app)
      .post('/api/articles/invalid/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      username: 'butter_bridge', 
    })
      .expect(400)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("Invalid input type - Text")
      })
    });
    it('POST 400: gives a 400 error when not given enough information', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
    })
      .expect(400)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("Not enough information. Please input 'body' & 'username'")
      })
    });
    it('POST 400: gives a 400 error when the given username does not exist', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
        username: 'chrisjericho'
    })
      .expect(404)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("This user does not have an account")
      })
    });
  });


// GET Comments by article ID   (NEED TO HANDLE ERROR FOR WHEN AN ARTICLE HAS NO COMMENTS)
  describe('/api/articles/:article_id/comments', () => {
    it('GET: 200 - returns an array of comments when valid article id is input', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body: { comments }}) => {
          expect(comments).to.be.an("array")
          comments.forEach(comment => {
            expect(comment).to.have.keys("comment_id", "votes", "created_at", "author", "body")
          })
          expect(comments.length).to.equal(13)
        })
    });
    it('GET: 200 - returns a 200 status when given an existing article has no comments', () => {
      return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({body: { comments }}) => {
          expect(comments).to.eql([])
        })
    });
    it('GET: 200 - returns an array of comments sorted by "created_at", in ascending order', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=created_at&&order=asc')
        .expect(200)
        .then(({body: { comments }}) => {
          expect(comments).to.be.an("array")
          expect(comments.length).to.equal(13)
          expect(comments[12]).to.eql({
            comment_id: 2,
            votes: 14,
            created_at: '2016-11-22T12:36:03.389Z',
            author: 'butter_bridge',
            body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
          })
        })
    });
    it('GET: 200 - returns an array of comments sorted by "votes", in ascending order', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=votes&&order=asc')
        .expect(200)
        .then(({body: { comments }}) => {
          expect(comments).to.be.an("array")
          expect(comments.length).to.equal(13)
          expect(comments[12]).to.eql({
            comment_id: 3,
            votes: 100,
            created_at: '2015-11-23T12:36:03.389Z',
            author: 'icellusedkars',
            body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.'
          })
          expect(comments[0]).to.eql({
            comment_id: 4,
            votes: -100,
            created_at: '2014-11-23T12:36:03.389Z',
            author: 'icellusedkars',
            body: ' I carry a log — yes. Is it funny to you? It is not to me.'
          })
        })
    });
    it('GET: 404 - returns an error when given an article ID that does not exist', () => {
      return request(app)
        .get('/api/articles/29/comments')
        .expect(404)
        .then(({body: { msg }}) => {
          expect(msg).to.equal("If Article 29 does not appear in our archives, it does not exist. Impossible... perhaps the achives are incomplete!")
        })
    });
    it('GET: 400 - returns an error when given an invalid article ID', () => {
      return request(app)
        .get('/api/articles/jimmyhavoc/comments')
        .expect(400)
        .then(({body: { msg }}) => {
          expect(msg).to.equal('Invalid input type - Text')
        })
    });
  });


  //PATCH Comments by ID
  describe('/api/comments/:comment_id', () => {
    it('PATCH: 200 - updates the vote count and responds with the full, updated comment', () => {
      return request(app)
      .patch('/api/comments/2')
      .send({
        inc_votes : 1
      })
      .expect(200)
      .then(({ body : { comment } }) => {
        expect(comment).to.be.an("object")
      })
    });
    it('PATCH: 200 - returns an updated comment object with the correct keys', () => {
      return request(app)
      .patch('/api/comments/2')
      .send({
        inc_votes : 1
      })
      .expect(200)
      .then(({ body : { comment } }) => {
        expect(comment).to.have.keys("comment_id", "author", "article_id", "votes", "created_at", "body")
      })
    });
    it('PATCH: 200 - returns an updated object with the correct keys and the correctly updated key (increasing)', () => {
      return request(app)
      .patch('/api/comments/2')
      .send({
        inc_votes : 1
      })
      .expect(200)
      .then(({ body : { comment } }) => {
        expect(comment.votes).to.have.equal(15)
      })
    });
    it('PATCH: 200 - returns an updated object with the correct keys and the correctly updated key (decreasing)', () => {
      return request(app)
      .patch('/api/comments/2')
      .send({
        inc_votes : -3
      })
      .expect(200)
      .then(({ body : { comment } }) => {
        expect(comment.votes).to.have.equal(11)
      })
    });
    it('PATCH: 200 - returns an updated object with unaltered keys returned unedited', () => {
      return request(app)
      .patch('/api/comments/2')
      .send({
        inc_votes : 1
      })
      .expect(200)
      .then(({ body : { comment } }) => {
        expect(comment).to.eql({
          comment_id: 2,
          author: 'butter_bridge',
          article_id: 1,
          votes: 15,
          created_at: '2016-11-22T12:36:03.389Z',
          body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
        })
      })
    });
    it("PATCH: 200 - returns an unedited comment object when no valid update key is found", () => {
      return request(app)
      .patch('/api/comments/2')
      .send({
        vote : 1
      })
      .expect(200)
      .then(({ body : {comment}}) => {
        expect(comment.votes).to.equal(14)
      })
    })
    it("PATCH: 404 - returns a 404 error when attempting to update a comment that doesn't exist", () => {
      return request(app)
      .patch('/api/comments/78')
      .send({
        inc_votes : 1
      })
      .expect(404)
      .then(({ body : {msg}}) => {
        expect(msg).to.equal("Comment with ID '78' does not exist!")
      })
    })
    it("PATCH: 400 - returns a 400 error when attempting to update an invalid data-type (ie. comment ID is text", () => {
      return request(app)
      .patch('/api/comments/thiscomment')
      .send({
        inc_votes : 1
      })
      .expect(400)
      .then(({ body : {msg}}) => {
        expect(msg).to.equal("Invalid input type - Text")
      })
    })
    it("PATCH: 400 - returns a 400 error when attempting to update a valid ID with an invalid patch value (ie. string", () => {
      return request(app)
      .patch('/api/comments/2')
      .send({
        inc_votes : "One"
      })
      .expect(400)
      .then(({ body : {msg}}) => {
        expect(msg).to.equal("Invalid input type - Text")
      })
    })
  });

  //DELETE Comments
  describe('/api/comments/:comment_id', () => {
    it('DELETE:  204: Deletes a row in the comments table and responds with a 204 status, with no content', () => {
      return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(undefined)
      })
    });
    it('DELETE 204: Returns an array of comments for the article which originally included the deleted comment, without that comment', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body : {comments}}) => {
          const comparision = comments.find(comment => comment.comment_id === 2)
          expect(comparision).to.eql({
            comment_id: 2,
            votes: 14,
            created_at: '2016-11-22T12:36:03.389Z',
            author: 'butter_bridge',
            body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
          })
        })
      .then(() => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then(()=>{
          return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({body : {comments}}) => {
            const comparison = comments.find(comment => comment.comment_id === 2)
            expect(!comparison)
          })
        })

      })
      })
      
    it("DELETE 404: Responds with a 404 status with a message if a delete request is sent for a comment that doesn't exist", () => {
      return request(app)
      .delete('/api/comments/60')
      .expect(404)
      .then(({ body : { msg } }) => {
        expect(msg).to.equal("Comment with ID '60' does not exist!")
      })
    })

    it("DELETE 400: Responds with a 400 status with a message if a delete request is sent for an invalid data type (ie. text)", () => {
      return request(app)
      .delete('/api/comments/commentstring')
      .expect(400)
      .then(({ body : { msg } }) => {
        expect(msg).to.equal('Invalid input type - Text')
      })
    })
    })
  

  //GET Users by username
  describe("/api/users/:username", () => {
    it("GET: 200 - returns an individual username", () => {
      return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.be.an("object");
          expect(user).to.have.keys('username', 'name', 'avatar_url');
        });
    });
    it("GET: 404 - returns an error when given a username that doesn't exist", () => {
      return request(app)
        .get('/api/users/kennyomega')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("User 'kennyomega' does not exist!")
        });
    });
  });



  //ERRORS - INVALID PATHS
  describe('/invalidpath', () => {
    it('GET: 404 - returns a 404 error when an invalid path is given for a GET request', () => {
      return request(app)
      .get('/api/2')
      .expect(404)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("I'm afraid I can go no further")
      })
    });
    it('POST: 404 - returns a 404 error when an invalid path is given for a POST request', () => {
      return request(app)
      .post('/api/2')
      .send({body: "COMMENT", created_by: "lurker"})
      .expect(404)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("I'm afraid I can go no further")
      })
    });
    it('PATCH: 404 - returns a 404 error when an invalid path is given for a PATCH request', () => {
      return request(app)
      .patch('/api/2')
      .send({inc_votes: 1})
      .expect(404)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("I'm afraid I can go no further")
      })
    });
    it('DELETE: 404 - returns a 404 error when an invalid path is given for a DELETE request', () => {
      return request(app)
      .delete('/api/2')
      .expect(404)
      .then(({body : {msg}}) => {
        expect(msg).to.equal("I'm afraid I can go no further")
      })
    });
  });

  //ERRORS - INVALID METHODS TOPICS ENDPOINT
  describe('/invalidmethod-topics', () => {
    it('PATCH: 405 - returns a 405 error when the topics endpoint is given a PATCH request', () => {
      return request(app)
      .patch('/api/topics')
      .send({inc_votes: 1})
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('POST: 405 - returns a 405 error when the topics endpoint is given a POST request', () => {
      return request(app)
      .post('/api/topics')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      created_by: 'butter_bridge'
    })
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('DELETE: 400 - returns a 400 error when the topics endpoint is given a DELETE request', () => {
      return request(app)
      .delete('/api/topics')
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
  });

  //ERRORS - INVALID METHODS USERS ENDPOINT
  describe('/invalidmethod-users', () => {
    it('PATCH: 405 - returns a 405 error when the users endpoint is given a PATCH request', () => {
      return request(app)
      .patch('/api/users/lurker')
      .send({inc_votes: 1})
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('POST: 405 - returns a 405 error when the topics endpoint is given a POST request', () => {
      return request(app)
      .post('/api/users/lurker')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      created_by: 'butter_bridge'
    })
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('DELETE: 405 - returns a 405 error when the topics endpoint is given a DELETE request', () => {
      return request(app)
      .delete('/api/users/lurker')
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
  });

  //ERRORS - INVALID METHODS ARTICLES
  describe('/invalidmethod-articles', () => {
    it('PATCH: 405 - returns a 405 error when the articles endpoint is given a PATCH request', () => {
      return request(app)
      .patch('/api/articles')
      .send({inc_votes: 1})
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('POST: 405 - returns a 405 error when the articles endpoint is given a POST request', () => {
      return request(app)
      .post('/api/articles')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      created_by: 'butter_bridge'
    })
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('DELETE: 405 - returns a 405 error when the articles endpoint is given a DELETE request', () => {
      return request(app)
      .delete('/api/articles')
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
  });

  //ERRORS - INVALID METHODS ARTICLES/:ARTICLE_ID
  describe('/invalidmethod-articles', () => {
    it('POST: 405 - returns a 405 error when the articles/:article_id endpoint is given a POST request', () => {
      return request(app)
      .post('/api/articles/1')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      created_by: 'butter_bridge'
    })
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('DELETE: 405 - returns a 405 error when the articles/:article_id endpoint is given a DELETE request', () => {
      return request(app)
      .delete('/api/articles/1')
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
  });

  //ERRORS - INVALID METHODS ARTICLES/:ARTICLE_ID/COMMENTS
  describe('/invalidmethod-articles', () => {
    it('POST: 405 - returns a 405 error when the articles/:article_id endpoint is given a PATCH request', () => {
      return request(app)
      .patch('/api/articles/1/comments')
      .send({inc_votes: 1})
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('DELETE: 405 - returns a 405 error when the articles/:article_id endpoint is given a DELETE request', () => {
      return request(app)
      .delete('/api/articles/1/comments')
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
  });

  //ERRORS - INVALID METHODS COMMENTS
  describe('/invalidmethod-comments', () => {
    it('PATCH: 405 - returns a 405 error when the comments endpoint is given a PATCH request', () => {
      return request(app)
      .patch('/api/comments')
      .send({inc_votes: 1})
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('POST: 405 - returns a 405 error when the comments endpoint is given a POST request', () => {
      return request(app)
      .post('/api/comments')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      created_by: 'butter_bridge'
    })
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('DELETE: 405 - returns a 405 error when the comments endpoint is given a DELETE request', () => {
      return request(app)
      .delete('/api/comments')
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
  });

  //ERRORS - INVALID METHODS COMMENTS/:COMMENT_ID
   describe('/invalidmethod-comments/:comment_id', () => {
    it('POST: 405 - returns a 400 error when the comments/:comment_id endpoint is given a POST request', () => {
      return request(app)
      .post('/api/comments/1')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      created_by: 'butter_bridge'
    })
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('GET: 405 - returns a 400 error when the comments/:comment_id endpoint is given a GET request', () => {
      return request(app)
      .get('/api/comments/1')
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
  });

  //ERRORS - INVALID METHODS API
  describe('/invalidmethod-api', () => {
    it('POST: 405 - returns a 405 error when the /api endpoint is given a POST request', () => {
      return request(app)
      .post('/api')
      .send({body:
        "WHAT A WONDERFUL COMMENT THIS IS",
      created_by: 'butter_bridge'
    })
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('PATCH: 405 - returns a 405 error when the /api endpoint is given a PATCH request', () => {
      return request(app)
      .patch('/api')
      .send({inc_votes: 1})
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
    it('DELETE: 405 - returns a 405 error when the api endpoint is given a DELETE request', () => {
      return request(app)
      .delete('/api')
      .expect(405)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(`Oak's words echoed, "There's a time and a place for everything, but not now"`)
      })
    });
  });
});


