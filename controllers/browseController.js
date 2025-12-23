const db = require('../db/queries.js');
const {
  body,
  validationResult,
  matchedData
} = require('express-validator');

const categoryMap = {
  'developers': {name: 'developer', table: 'developers', junction: null, labelSingle: 'Developer', labelPlural: 'Developers'},
  'publishers': {name: 'publisher', table: 'publishers', junction: null, labelSingle: 'Publisher', labelPlural: 'Publishers'},
  'platforms': {name: 'platform', table:'platforms', junction: 'game_platforms', labelSingle: 'Platform', labelPlural: 'Platforms'},
  'genres': {name: 'genre', table: 'genres', junction: 'game_genres', labelSingle: 'Genre', labelPlural: 'Genres'}
}

exports.showList = async (req, res, next) => {
  const categoryType = req.params.categoryType;
  const category = categoryMap[categoryType];

  const list = await db.browseListCategory(category.table, category.name);
  res.render('browseList', {
    category,
    list
  })
}

exports.showSingle = async (req, res, next) => {
  const categoryType = req.params.categoryType;
  const category = categoryMap[categoryType];
  const id = req.params.id

  const item = await db.browseGetById(category, id);
  const games = await db.browseGetGamesByCatId(category, id);
  res.render('browseDetails', {
    category,
    item,
    games
  });
}