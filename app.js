require('dotenv').config();
const { error } = require('console');
const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

// Routers

//Error Handling
app.use((error, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).render('error', {
    title: 'An Error Occurred',
    message: process.env.NODE_ENV === 'production'
        ? 'Something went wrong on our end.'
        : err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});