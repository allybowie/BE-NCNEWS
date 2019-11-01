const usersRouter = require('express').Router();
const {getUser} = require('../controllers/userscon');
const {invalidMeth} = require('../errorhandlers')

usersRouter.route('/:username').get(getUser).all(invalidMeth);

module.exports = usersRouter;
