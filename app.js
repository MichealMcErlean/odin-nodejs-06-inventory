require('dotenv').config();
const { error } = require('console');
const express = require('express');
const path = require('path');
const app = express();
const indexRouter = require('./routes/indexRouter')
const gamesRouter = require('./routes/gamesRouter')
const developersRouter = require('./routes/developersRouter')
const publishersRouter = require('./routes/publishersRouter')
const genresRouter = require('./routes/genresRouter');
const platformsRouter = require('./routes/platformsRouter');
const browseRouter = require('./routes/browseRouter');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

// Routers
app.use('/', indexRouter);
app.use('/games', gamesRouter);
app.use('/browse', browseRouter);

app.use('/platforms', platformsRouter);
app.use('/genres', genresRouter);
app.use('/publishers', publishersRouter);
app.use('/developers', developersRouter);


//Error Handling
app.use((err, req, res, next) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Inventory app listening on port ${PORT}`);
})