/**
 * @module index.js
 * @description This is a main server file
 * @author Petrov Alexey
 */

const bodyParser = require('body-parser');
const express = require('express');
const _ = require('lodash');
const shortId = require('shortid');
const validUrl = require('valid-url');
const queries = require('./queries');

const PORT = 5000;
const ADDRESS = 'localhost';
const PROTOCOL = 'http';

// app
const app = express();
app.use(bodyParser.json());

// starts server
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

// logic
/**
 * returns an error object
 * @param {String} errorText
 * @returns {Object}
 */
const makeAnErrorObject = (errorText) => ({ status: 'error', errorText });

/**
 * process income url
 * @param {String} url
 * @returns {Object}
 */
const processUrl = async (url) => {
  const generatedCode = shortId();
  const shortUrl = `${PROTOCOL}://${ADDRESS}:${PORT}/${generatedCode}`;
  const link = {
    original_link: url,
    short_link: shortUrl,
    generated_code: generatedCode,
    transition_count: 0,
  };

  let result = null;

  try {
    result = await queries.findOrCreate(link);
  } catch (err) {
    result = makeAnErrorObject(err.message);
  }

  return result;
};

// router
// index page
// TODO
app.get('/', async (req, res) => {
  // const result = await knex(LINKS).select('*');

  res.json({ message: 'Hello world', rowsInTable: result });
});

// create new link
app.post('/new', async (req, res) => {
  const url = req.body.url || '';

  if (validUrl.isUri(url)) {
    const result = await processUrl(url);
    res.status(200).json(result);
  } else {
    res.status(401).json(makeAnErrorObject('Invalid url.'));
  }
});

// get link
app.get('/:code', async (req, res) => {
  const linkCode = req.params.code;
  let result = null;

  try {
    result = await queries.getLinkAndUpdate(linkCode);
  } catch (err) {
    res.status(401).json(err.message);
  }

  if (result) {
    res.redirect(result);
  } else {
    res.status(404).json(makeAnErrorObject('Link not found.'));
  }
});
