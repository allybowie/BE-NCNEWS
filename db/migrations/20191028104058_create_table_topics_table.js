
exports.up = function(knex) {
  console.log("Creating topics table");
  return knex.schema.createTable('topics', (topicsTable => {
      topicsTable.string('slug').primary();
      topicsTable.string('description', 255).notNullable();
  }))
};

exports.down = function(knex) {
  console.log('removing topics tables...');
  return knex.schema.dropTable('topics');
};
