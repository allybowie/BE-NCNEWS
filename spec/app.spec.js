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

  //GET Topics
  describe("/topics", () => {
    it("GET: 200 - returns an array of all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
          expect(topics.length).to.equal(3);
          topics.forEach(topic => {
            expect(topic).to.have.keys(["slug", "description"]);
          });
        });
    });
  });

  //GET Articles
  describe("/articles", () => {
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
  });

  //GET Article by ID
  describe("/api/articles/:article_id", () => {
    it("GET: 200 - returns an individual article", () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an("object");
          expect(article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count' );
          expect(article.comment_count).to.equal('13')
        });
    });
  })
  describe('/api/articles/:article_id', () => {
    it('GET 404 - returns an error when given an article ID that does not exist', () => {
      return request(app)
        .get('/api/articles/29')
        .expect(404)
        .then(({body: { msg }}) => {
          expect(msg).to.equal("Article with ID '29' does not exist!")
        })
    });
    it('GET 400 - returns an error when given an invalid article ID', () => {
      return request(app)
        .get('/api/articles/jimmyhavoc')
        .expect(400)
        .then(({body: { msg }}) => {
          expect(msg).to.equal('Invalid input type - Text')
        })
    });
  });


// GET Comments by article ID
  describe('/api/articles/:article_id/comments', () => {
    it('GET 200 - returns an array of comments when valid article id is input', () => {
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
    it('GET 200 - returns an array of comments sorted by "created_at", in ascending order', () => {
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
    it('GET 200 - returns an array of comments sorted by "votes", in ascending order', () => {
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
    it('GET 404 - returns an error when given an article ID that does not exist', () => {
      return request(app)
        .get('/api/articles/29/comments')
        .expect(404)
        .then(({body: { msg }}) => {
          expect(msg).to.equal("Article with ID '29' does not exist!")
        })
    });
    it('GET 400 - returns an error when given an invalid article ID', () => {
      return request(app)
        .get('/api/articles/jimmyhavoc/comments')
        .expect(400)
        .then(({body: { msg }}) => {
          expect(msg).to.equal('Invalid input type - Text')
        })
    });
  });

  //DELETE Comments
  describe.only('/api/comments/:comment_id', () => {
    it('DELETE  204: Deletes a row in the comments table and responds with a 204 status, with no content', () => {
      return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then(({body : {msg}}) => {
        expect(msg).to.equal(undefined)
      })
    });
    it('GET 200: Returns an array of comments for the article which originally included the deleted comment, without that comment', () => {
      return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({body : {comments}}) => {
        expect(!comments.includes({
          comment_id: 2,
          votes: 14,
          created_at: '2016-11-22T12:36:03.389Z',
          author: 'butter_bridge',
          body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
        }))
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
});