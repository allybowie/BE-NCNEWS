process.env.NODE_ENV = "test";
const app = require('../app')
const chai = require('chai');
const {expect} = require('chai');
const chaiSorted = require('chai-sorted');
const request = require('supertest');
const connection = require('../db/connection');
chai.use(require('chai-sorted'));

describe('/api', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    after(() => connection.destroy());
    describe('/topics', () => {
        it('GET: 200 - returns an array of all topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body : {topics}}) => {
            expect(topics).to.be.an("array")
            expect(topics.length).to.equal(3)
            topics.forEach(topic => {
                expect(topic).to.have.keys(['slug', 'description'])
            })
            })
        });
    });
})