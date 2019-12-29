const mongo = require('./mongo');
const gktime = require('./gktime');
const config = require('./config');

(async function () {
    try {
        await gktime.fetchArticles(config.geektime.startArticleID);
        await mongo.closeClient();
    } catch (e) {
        console.log(e);
    }
})();
