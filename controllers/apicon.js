const fs = require('fs');
const {fetchEndpoints} = require('../models/apimod')

exports.getEndpoints = (req, res, next) => {
    console.log("API ENDPOINT")
    return fetchEndpoints()
}