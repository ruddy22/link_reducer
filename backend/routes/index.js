/**
 * @module routes/index.js
 * @author Petrov Alexey
 */

const shortId = require('shortid');
const validUrl = require('valid-url');
const queries = require('../queries');

const PORT = 5000;
const ADDRESS = 'localhost';
const PROTOCOL = 'http';

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

/**
 * index page handler
 * returns index page with some statistics
 */
const handleIndex = async (req, res) => {
  const info = await queries.getStat();
  res.render('index', { info });
};

/**
 * new link handler
 */
const handleNewLink = async (req, res) => {
  const url = req.body.url || '';

  if (validUrl.isUri(url)) {
    const result = await processUrl(url);
    res.status(200).json(result);
  } else {
    res.status(401).json(makeAnErrorObject('Invalid url.'));
  }
};

/**
 * short code handler
 */
const handleCode = async (req, res) => {
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
};

/**
 * module api
 */
module.exports = (app) => {
  // get index page
  app.get('/', handleIndex);

  // create new link
  app.post('/', handleNewLink);

  // handle short code
  app.get('/:code', handleCode);
};
