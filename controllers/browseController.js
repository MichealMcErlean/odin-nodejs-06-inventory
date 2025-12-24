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

exports.addItemPage = async (req, res, next) => {
  const categoryType = req.params.categoryType;
  const category = categoryMap[categoryType];
  res.render('browseAdd', {
    category
  })
}

const validateItem = [
  body('newItem').trim()
    .isLength({min: 1, max: 60}).withMessage('Must be between 1 and 60 characters in length')
]

exports.addItemAction = [
  validateItem,
  async (req, res, next) => {
    const categoryType = req.params.categoryType;
    const category = categoryMap[categoryType];
    const errors = validationResult(req).errors;

    console.log('Value of category:', category);
    console.log('Value of categoryType:', categoryType)

    if (errors.length != 0) {
      console.log('Errors detected');
      return res.status(400).render('browseAdd', {
        category,
        errors
      })
    }

    try {
      await db.browseAdd(category, matchedData(req));
      res.redirect('/browse/' + category.table);
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error')
    }

  }
]

exports.updatePage = async (req, res, next) => {
  const categoryType = req.params.categoryType;
  const category = categoryMap[categoryType];
  const id = req.params.id

  const item = await db.browseGetById(category, id);
  console.log('Value of item:', item)

  res.render('browseUpdate', {
    item: item[0],
    category,
    id
  });
}

exports.updateAction = [
  validateItem,
  async (req, res, next) => {
    const categoryType = req.params.categoryType;
    const category = categoryMap[categoryType];
    const id = req.params.id;

    const errors = validationResult(req).errors;
    if (errors.length != 0) {
      console.log('Errors detected');
      const item = await db.browseGetById(category, id);
      return res.status(400).render('browseUpdate', {
        item: item[0],
        category,
        id,
        errors
      })
    }

    try {
      await db.browseUpdate(category, id, matchedData(req));
      res.redirect(`/browse/${category.table}`);
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error');
    }
  }
]

exports.deleteItem = async (req, res, next) => {
  const categoryType = req.params.categoryType;
  const category = categoryMap[categoryType];
  const id = req.params.id;

  await db.browseDelete(category, id);
  res.redirect(`/browse/${category.table}`);
}