const links = 'links';

exports.up = async (knex) => {
  const exists = await knex.schema.hasTable(links);

  if (!exists) {
    return knex.schema.createTable(links, (table) => {
      table.increments();
      table.string('original_link');
      table.string('short_link');
      table.string('generated_code');
      table.integer('transition_count');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  return null;
};

exports.down = (knex) => {
  return knex.schema.dropTable(links);
};
