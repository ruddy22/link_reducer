/**
 * @module index.js
 * @description This is a main server file
 * @author Petrov Alexey
 */

const express = require('express');
const _ = require('lodash');
const knexOptions = require('./knexfile');
const knex = require('knex')(knexOptions.development);

// fns
const idToShortLink = () => {

};

const shortLinkToId = () => {

};

// app
const app = express();

// starts server
app.listen(5000, () => console.log('Server started! Checks http://localhost:5000'));

// router
app.get('/', async (req, res) => {
  const result = await knex('links').select('*');

  res.json({ message: 'Hello world', rowsInTable: result });
});

// app.post('/create_link', (req, res) => {
app.get('/create_link', async (req, res) => {
  const result = await knex('links')
    .insert({ link: 'link', transition_count: 0 });
  const id = _.first(result);

  const shortLink = idToShortLink();

  res.json({ status: 'ok' });
});

app.get('/:shortId', async (req, res) => {
  const linkId = shortLinkToId(shortId);
  const result = await knex('links').first(['link']);

  res.redirect(result.link);
});
