const db = require('../db/queries.js')
const {
  body,
  validationResult,
  matchedData
} = require('express-validator');

exports.platformsList = async (req, res, next) => {
  const platforms = await db.getAllPlatforms();
  res.render('platforms', {
    title: 'Platforms',
    platforms
  });
}