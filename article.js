const mongo = require('./mongo')
const config = require('./config')

let mongoClient = null;

const queryArticles = async () => {
    mongoClient = await mongo.getClient();
    const query = {
        _id: 1,
        articleContent: 1,
        articleCover: 1,
        articleCtime: 1,
        articleID: 1,
        articleTitle: 1,
        authorName: 1,
        articleUrl: 1,
        course: 1,
        articleNeighbors: 1,
    };

    if (config.geektime.downloadComment) {
        query.comments = 1;
        query.commentsTotal = 1;
    }
    if (config.geektime.downloadAudio) {
        query.audioTitle = 1;
        query.audioDownloadUrl = 1;
    }

    const articles = await mongoClient
        .db(config.mongo.dbname)
        .collection(config.geektime.courseName)
        .find({}, { sort: { articleCtime: 1 }, projection: query })
        .toArray();

    mongo.closeClient();
    return articles;
}

module.exports = {
    queryArticles,
}