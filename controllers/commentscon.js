const {selectComments} = require('../models/commentsmod')

exports.getComments = (req,res,next) => {
    const {sort_by , order} = req.query

    
    console.log("CONTROLLLLLERRRRR")
    const article_id = req.params
    return selectComments(article_id , sort_by , order).then(comments=> {
        res.status(200).send({comments})
    }).catch(next)
}