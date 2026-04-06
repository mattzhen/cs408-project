require('dotenv').config({ path: '../.env' });
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./bin/db');
const fs = require('fs');
const session = require('express-session');

const index = require('./routes/index');
const create = require('./routes/create-account');
const login = require('./routes/login');
const groceries = require('./routes/groceries');
const addItem = require('./routes/add-item');
const moreInfo = require('./routes/item-details');

const app = express();

//Ensure the data directory exists

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const dbFileName = process.env.DB_NAME || 'database.sqlite';
const dbPath = path.join(dataDir, dbFileName);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const databaseManager = db.createDatabaseManager(dbPath);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Static files in public directory images, css, js, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Static html files in the static directory
// This is for static files that are not using a template engine
app.use(express.static(path.join(__dirname, 'static')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Middleware to attach database to request
app.use((request, response, next) => {
  request.db = databaseManager.dbHelpers;
  next();
});
app.use('/', index);
app.use('/', create);
app.use('/', login);
app.use('/', groceries);
app.use('/', addItem);
app.use('/', moreInfo);

// Used for testing purposes to clear and seed the database
if (process.env.NODE_ENV === 'test') {
  app.post('/test/reset', (req, res) => {
    databaseManager.dbHelpers.clearDatabase();
    databaseManager.dbHelpers.seedTestData();
    res.sendStatus(200);
  });
}

module.exports = app;
