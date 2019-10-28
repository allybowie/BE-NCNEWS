exports.formatDates = list => {
    let formatDate = list.map(object => {
        let newObj = {...object}
        let newTime = new Date(object.created_at).toLocaleString()
        // console.log(newTime)
        newObj.created_at = newTime
        return newObj
    })
    return formatDate
};

const date = new Date(1542284514171)

exports.makeRefObj = list => {
    const newObj = {}

    list.forEach(article => {
        newObj[article.article_id] = article.title
    })

    return newObj
};

exports.formatComments = (comments, articleRef) => {};
