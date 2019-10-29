const usersRouter = require('express').Router();
const {getUser} = require('../controllers/userscon');

usersRouter.route('/:username').get(getUser);

module.exports = usersRouter;
