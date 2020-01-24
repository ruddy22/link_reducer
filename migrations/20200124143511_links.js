const links = 'links';

exports.up = (knex) => {
  return knex.schema.createTableIfNotExists(links, (table) => {
    table.increments();
    table.string('original_link');
    table.string('short_link');
    table.string('generated_code');
    table.integer('transition_count');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = (knex) => {
  return knex.schema.dropTable(links);
};
