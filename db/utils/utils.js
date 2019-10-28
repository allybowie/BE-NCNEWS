exports.formatDates = list => {
    return list.map(object => {
        let newObj = {...object}
        let newTime = new Date(object.created_at).toLocaleString()
        // console.log(newTime)
        newObj.created_at = newTime
        return newObj
    })
};

exports.makeRefObj = list => {
    const newObj = {}

    list.forEach(article => {
        newObj[article.title] = article.article_id
    })

    return newObj
};

exports.formatComments = (comments, articleRef) => {
    return comments.map(comment => {

        let newObj = {...comment};

        newObj.author = comment.created_by;
        newObj.created_at = new Date(comment.created_at).toLocaleString();
        newObj.article_id = articleRef[comment.belongs_to]

        delete newObj.created_by;
        delete newObj.belongs_to;

        return newObj
    })
};
