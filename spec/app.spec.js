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
          articles.forEach(article => {
            expect(article).to.have.keys([
              "title",
              "article_id",
              "author",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
          });
          expect(articles[0].comment_count).to.equal(13);
          expect(articles[5].comment_count).to.equal(1);
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
          expect(article).to.eql({
            title: 'Living in the shadow of a great man',
            author: 'butter_bridge',
            article_id: 1,
            body: 'I find this existence challenging',
            topic: 'mitch',
            created_at: '2018-11-15T12:21:54.171Z',
            votes: 100,
            comment_count: 13
          })
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
  

  //GET Users
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