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

exports.platformAddPage = async (req, res, next) => {
  res.render('platformAdd', {
    title: 'Add New Platform'
  })
}

const validatePlatform = [
  body('newplatformname').trim()
    .isLength({min: 1, max: 60}).withMessage('Must be between 1 and 60 characters in length.')
]

exports.platformAddAction = [
  validatePlatform,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('platformAdd', {
        title: 'New Publisher',
        errors: errors
      })
    }
    try {
      await db.platformAdd(matchedData(req));
      res.redirect('/platforms');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error')
    }
  }
]

exports.platformDetails = async (req, res, next) => {
  const {platform_id} = req.params;
  const platform = await db.platformGetById(platform_id);
  const games = await db.platformGetGamesByPlatformId(platform_id);
  res.render('platformDetails', {
    title: 'Platform Details',
    platform,
    games
  })
}

exports.platformUpdatePage = async (req, res, next) => {
  const {platform_id} = req.params;
  const platform = await db.platformGetById(platform_id);
  res.render('platformUpdate', {
    title: 'Update Platform',
    platform
  })
}

exports.platformUpdateAction = [
  validatePlatform,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('platformUpdate', {
        title: 'Update Genre',
        errors: errors
      })
    }
    const {platform_id} = req.params;
    const {newplatformname} = matchedData(req);

    try {
      await db.platformUpdateById(platform_id, newplatformname);
      res.redirect('/platforms');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error');
    }
  }
]