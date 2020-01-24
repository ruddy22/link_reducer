/**
 * @module index.js
 * @description This is a main server file
 * @author Petrov Alexey
 */

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
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
app.use(bodyParser.json());

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

app.post('/new', async (req, res) => {
  const url = req.body.url || '';
  console.log(req.body);

  if (validUrl.isUri(url)) {
    res.status(200).json(await processUrl(url));
  } else {
    res.status(401).json(makeAnErrorObject('Invalid url.'));
  }
});

app.get('/:code', async (req, res) => {
  const linkCode = req.params.code;
  let result =  null;

  try {
    result = await knex(LINKS).first('original_link').where({ generated_code: linkCode });
  } catch (err) {
    res.status(401).json(err.message);
  }

  if (result) {
    res.redirect(result.link);
  } else {
    res.status(404).json(makeAnErrorObject('Link not found.'));
  }
});
