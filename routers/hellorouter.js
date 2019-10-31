const hellothereRouter = require('express').Router();
const {invalidMeth} = require('../psqlerrorlist');
const {getHello} = require('../controllers/hellocontroller');

hellothereRouter.route('/').get(getHello).all(invalidMeth);

module.exports = hellothereRouter;

