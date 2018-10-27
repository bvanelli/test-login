exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id_usuario').primary();
    table.uuid('id_assinante').notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('endereco').notNullable();
    table.string('email').unique().notNullable();
    table.boolean('paid').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('last_access');
    table.jsonb('profile');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
