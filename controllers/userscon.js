const { selectUser } = require('../models/usersmod');

exports.getUser = (req, res, next) => {
    const { username } = req.params
    return selectUser(username).then(([user]) => {
        res.status(200).send({ user })
    })
}