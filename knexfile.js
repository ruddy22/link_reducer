/**
 * @module knexfile.js
 */

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './backend/dev.sqlite3',
  },
  useNullAsDefault: true,
};
