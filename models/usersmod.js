const connection = require('../db/connection')

exports.selectUser = (username) => {
    console.log(username)
    return connection
    .select('*')
    .from('users')
    .where('username', '=', username)
}