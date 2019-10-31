const fs = require('fs');

exports.fetchEndpoints = () => {
    return fs.readFile('./endpoints.json', (err, object) => {
        const parsed = JSON.parse(object)
        return parsed
      })
}