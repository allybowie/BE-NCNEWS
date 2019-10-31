const {fetchHello} = require('../models/hellomodel');

exports.getHello = (req, res, next) => {
    return fetchHello((err, hello) => {
        const {msg} = hello
        res.status(200).send({msg})
    })
}