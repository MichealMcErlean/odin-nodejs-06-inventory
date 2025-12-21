const db = require('../db/queries.js')
const {
  body,
  validationResult,
  matchedData
} = require('express-validator');

exports.pubList = async (req, res, next) => {
  const pubs = await db.getAllPublishers();
  res.render('pubs', {
    title: 'Publishers',
    pubs: pubs
  });
};

exports.pubAddPubForm = async (req, res, next) => {
  res.render('pubAdd', {
    title: 'Add New Publisher'
  });
}

const validatePub = [
  body('newpubname').trim()
    .isLength({min: 1, max: 60}).withMessage('Must be between 1 and 60 characters.')
]

exports.pubAddPubAction = [ 
  validatePub,
  async (req, res, next) => {
    console.log(validationResult(req));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('pubAdd', {
        title: 'New Publisher',
        errors: errors
      })
    }
    try {
      await db.addPub(matchedData(req));
      res.redirect('/publishers');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error')
    }
  } 
]

exports.pubGetDetails = async (req, res, next) => {
  const {publisher_id} = req.params;
  const pub = await db.pubGetById(publisher_id);
  const games = await db.pubGetGamesByPubId(publisher_id);
  console.log('pub contents:', pub);
  console.log('games contents:', games)
  res.render('pubDetails', {
    title: 'Publisher Details',
    pub,
    games
  });
}

exports.pubUpdatePage = async (req, res, next) => {
  const {publisher_id} = req.params;
  const pub = await db.pubGetById(publisher_id);
  res.render('pubUpdate', {
    title: 'Update Publisher',
    pub
  })
}

exports.pubUpdatePub = [
  validatePub,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('pubUpdate', {
        title: 'Update Publisher',
        errors: errors
      })
    }
    const {publisher_id} = req.params;
    const {newpubname} = matchedData(req);

    try {
      await db.pubUpdateById(publisher_id, newpubname);
      res.redirect('/publishers');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error');
    }
  }
]