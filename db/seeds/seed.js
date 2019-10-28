const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  const topicsInsertions = knex('topics').insert(topicData);
  const usersInsertions = knex('users').insert(userData);

  return knex.migrate
            .rollback()
            .then(() => knex.migrate.latest())
            .then(() => {
  return Promise.all([topicsInsertions, usersInsertions])})
    .then(([topicsInsertions, usersInsertions]) => {
    })
    .then(userStuff => {
      const formattedDates =  formatDates(articleData)
      // console.log(formattedDates)
      return knex('articles')
        .insert(formattedDates)
        .returning("*")
    })
    .then(articleRows => {

      console.log("Successfully seeded Topics, Users, Articles and Comments!")
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return knex('comments').insert(formattedComments)
      .returning("*");
    });
};
