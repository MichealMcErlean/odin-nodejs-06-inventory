const db=require('../db/queries.js');
const {
  body,
  validationResult,
  matchedData
} = require('express-validator');

exports.showGameList = async (req, res, next) => {
  console.log('Reached controller')
  const games = await db.getAllGames();
  console.log(games);
  res.render('games', {
    title: 'Games',
    games: games
  });
};

exports.showGame = async (req, res, next) => {
  const {game_id} = req.params;
  const game = await db.getGameById(game_id);
  res.render('gameDetails', {
    title: 'Game Details',
    game: game
  });
};