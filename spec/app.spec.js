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

  //GET Users
  describe.only("/api/users/:username", () => {
    it("GET: 200 - returns an individual username", () => {
      return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.be.an("object");
          expect(user).to.have.keys('username', 'name', 'avatar_url');
        });
    });
  });
});