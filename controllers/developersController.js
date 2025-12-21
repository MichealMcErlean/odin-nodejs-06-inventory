const db = require('../db/queries.js');
const {
  body,
  validationResult,
  matchedData
} = require('express-validator');

exports.showAllDevs = async (req, res, next) => {
  const devs = await db.getAllDevelopers();
  res.render('devs', {
    title: 'Developers',
    devs: devs
  })
}

exports.showDevById = async (req, res, next) => {
  const {developer_id} = req.params;
  const dev = await db.getDevById(developer_id);
  const games = await db.devGamesByDevId(developer_id);
  res.render('devDetails', {
    title: 'Developer Details',
    dev: dev,
    games: games
  })
}

exports.updateDev = async (req, res, next) => {
  const {developer_id} = req.params;
  console.log('Making it to updateDev')
  const dev = await db.getDevById(developer_id);
  res.render('devUpdate', {
    title: 'Update Developer',
    dev: dev
  });
}

const validateUpdate = [
  body('devname').trim()
    .isLength({min: 1, max: 60}).withMessage('Between 1 and 60 characters.')
]

exports.performUpdateDev = [
  validateUpdate,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('devUpdate', {
        title: 'Update Developer',
        errors: errors
      })
    }
    const {developer_id} = req.params;
    const {devname} = matchedData(req);
    console.log('Developer Value:', devname);
    console.log('Developer ID Value:', developer_id);
    console.log('Type of ID:', typeof developer_id);
    try {
      await db.updateDevById(developer_id, devname);
      res.redirect('/developers');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error');
    }
  }
]

exports.addDevPage = (req, res, next) => {
  res.render('devAdd', {
    title: 'Add New Developer'
  });
}

const validateDev = [
  body('newdevname').trim()
    .isLength({min: 1, max: 60}).withMessage('Must be between 1 and 60 characters')
]

exports.addDevToDB = [
  validateDev,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('devAdd', {
        title: 'Update Developer',
        errors: errors
      })
    }
    console.log("Matched Data is ", matchedData(req));
    try {
      await db.addDev(matchedData(req));
      res.redirect('/developers');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error')
    }
  }
]

exports.deleteDev = async (req, res, next) => {
  const {developer_id} = req.params;
  console.log('value of req.body:', req.params)
  await db.deleteDev(developer_id);
  res.redirect('/developers');
}