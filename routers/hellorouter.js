const hellothereRouter = require('express').Router();
const {invalidMeth} = require('../errorhandlers');
const {getHello} = require('../controllers/hellocontroller');

hellothereRouter.route('/').get(getHello).all(invalidMeth);

module.exports = hellothereRouter;

