const config = require('./config');
const tools = require('./tools');
const http = require('./http');
const mongo = require('./mongo');

const fetchArticle = async (articleID) => {
    const headers = {
        referer: config.geektime.baseUrl + articleID,
    }
    const body = {
        'id': articleID,
        'include_neighbors': true
    }

    const articleData = await http.post(config.geektime.url, body, headers);

    const article = {
        _id: tools.getMd5(articleData.article_title),
        articleID: articleID,
        articleTitle: articleData.article_title, // 文章标题
        articleUrl: config.geektime.baseUrl + articleID, // 文章地址
        articleContent: articleData.article_content, // 文章内容
        articleCover: articleData.article_cover, // 文章背景图
        authorName: articleData.author_name, // 文章作者
        articleCtime: articleData.article_ctime, // 文章创建时间 unix 时间戳 单位为 s 
        articleNeighbors: articleData.neighbors,  //  上下篇文章信息
        audioDownloadUrl: articleData.audio_download_url,
        audioTitle: articleData.audio_title,
        course: config.geektime.courseName, // 课程名称
    };
    return article;
}

const fetchComments = async (referer, articleId, prev = 0) => {
    console.log('开始获取 ', referer, '评论');
    let comments = [];
    let total = 0;
    async function run(prev) {

        const body = {
            aid: articleId,
            prev: prev
        }
        const headers = {
            referer: referer
        }
        const data = await http.post(config.geektime.commentUrl, body, headers);
        total = data.page.count;
        const nextPage = data.page.more;
        comments.push(...data.list);
        if (nextPage) {
            prev = data.list[data.list.length - 1].score;
            await tools.waitSomeTimes(3);
            await run(prev);
        }
    };
    try {
        await run(prev);
    } catch (e) {
        console.error(`获取${referer}评论失败!`)
    }
    console.log('结束获取 ', referer, '评论 总评论数为', total);
    return { comments, total };
}

const fetchNext = async (nextID, articles) => {
    const article = await fetchArticle(nextID)
    // 是否导出评论
    if (config.geektime.downloadComment) {
        const { comments, total } = await fetchComments(config.geektime.baseUrl + nextID, nextID);
        article.commentsTotal = total;
        article.comments = comments;
    }

    const mongoClient = await mongo.getClient();
    // 保存到mongo
    if (config.mongo) {
        mongoClient.db(config.mongo.dbname).collection(`${config.geektime.courseName}`).updateOne({ _id: article._id }, {$set: article}, {upsert: true});
    }

    articles.push(article);
    let next = article.articleNeighbors.right;
    await tools.waitSomeTimes(3)
    if (next && next.id) {
        await fetchNext(next.id, articles)
    };

}
const fetchArticles = async (startID) => {
    console.log(`开始获取专栏【${config.geektime.courseName}】`);
    const articles = [];
    let articleID = startID;

    await fetchNext(articleID, articles)

    console.log(`专栏【${config.geektime.courseName}】获取完毕！`);
    return articles;
};

module.exports = {
    fetchArticle,
    fetchArticles,
    fetchNext,
    fetchComments,
}
