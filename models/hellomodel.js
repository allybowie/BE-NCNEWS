const connection = require('../db/connection')
const fs = require('fs');


exports.fetchHello = cb => {
    return fs.readFile('./hellothere.json', (err, object) => {
        const parsed = JSON.parse(object)
        cb(null, parsed)
      })
}