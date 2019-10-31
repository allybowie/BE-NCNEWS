const usersRouter = require('express').Router();
const {getUser} = require('../controllers/userscon');
const {invalidMeth} = require('../psqlerrorlist')

usersRouter.route('/:username').get(getUser).all(invalidMeth);

module.exports = usersRouter;
