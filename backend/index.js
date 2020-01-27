/**
 * @module index.js
 * @description This is a main server file
 * @author Petrov Alexey
 */

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const routes = require('./routes');
require('dotenv').config();

/**
 * app initialization
 */
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

/**
 * constants
 */
const PORT = process.env.PORT || 5000;

/**
 * router
 */
routes(app);

/**
 * starts server
 */
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
