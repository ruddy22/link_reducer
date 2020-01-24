/**
 * @module index.js
 * @description This is a main server file
 * @author Petrov Alexey
 */

const express = require('express');
const _ = require('lodash');
const shortId = require('shortid');
const validUrl = require('valid-url');
const knexOptions = require('./knexfile');
const knex = require('knex')(knexOptions.development);

const PORT = 5000;
const ADDRESS = 'localhost';
const PROTOCOL = 'http';
const LINKS = 'links';

// app
const app = express();

// starts server
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

// router
app.get('/', async (req, res) => {
  const result = await knex(LINKS).select('*');

  res.json({ message: 'Hello world', rowsInTable: result });
});

const makeAnErrorObject = (errorText) => ({ status: 'error', errorText });

const processUrl = async (url) => {
  const generatedCode = shortId();
  const shortUrl = `${PROTOCOL}://${ADDRESS}:${PORT}/${generatedCode}`;

  try {
    await knex(LINKS).insert({
      original_link: url,
      short_link: shortUrl,
      generated_code: generatedCode,
      transition_count: 0,
    });
  } catch (err) {
    return makeAnErrorObject(err.message);
  }

  return {
    status: 'ok',
    data: {
      original: url,
      short: shortUrl
    },
  };
};

app.post('/create_link/:url', async (req, res) => {
  const url = req.params.url || '';
  const result = validUrl.isWebUri(url)
    ? await processUrl(url)
    : makeAnErrorObject('Invalid url.');

  res.json(result);
});

app.get('/:code', async (req, res) => {
  const linkCode = req.params.code;
  const result = await knex(LINKS).first('original_link').where({ generated_code: linkCode });

  if (result) {
    res.redirect(result.link);
  } else {
    res.json(makeAnErrorObject('Link not found.'));
  }
});
