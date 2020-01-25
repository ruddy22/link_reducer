/**
 * @module createDB.js
 * @author Petrov Alexey
 */

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

const config = require('./knexfile');
const existsPromise = promisify(fs.exists);

const fileName = config.connection.filename;

const findOrCreateDB = async () => {
  const exists = await existsPromise(fileName);

  if (!exists) {
    new sqlite3.Database(fileName);
  }
};

findOrCreateDB();
