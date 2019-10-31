const fs = require('fs');

exports.fetchEndpoints = cb => {
    return fs.readFile('./endpoints.json', (err, object) => {
        const parsed = JSON.parse(object)
        cb(null, parsed)
      })
}