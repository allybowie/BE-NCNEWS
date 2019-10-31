const fs = require('fs');
const {fetchEndpoints} = require('../models/apimod')

exports.getEndpoints = (req, res, next) => {
    fetchEndpoints((err, endpoints) => {
        res.status(200).json({endpoints})
    })
}