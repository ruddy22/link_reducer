const links = 'links';

exports.up = (knex) => {
  return knex.schema.createTableIfNotExists(links, (table) => {
    table.increments();
    table.string('link');
    table.integer('transition_count');
  })
};

exports.down = (knex) => {
  return knex.schema.dropTable(links);
};
