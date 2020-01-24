/**
 * @module index.js
 * @description This is a main server file
 * @author Petrov Alexey
 */

const express = require('express');
const knexOptions = require('./knexfile');
const knex = require('knex')(knexOptions.development);

// app
const app = express();

// starts server
app.listen(5000, () => console.log('Server started! Checks http://localhost:5000'));

// router
app.get('/', async (req, res) => {
  const result = await knex('links').select('*');

  res.json({ message: 'Hello world', rowsInTable: result });
});
