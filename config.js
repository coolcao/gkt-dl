module.exports = {
    geektime: {
        url: 'https://time.geekbang.org/serv/v1/article',
        commentUrl: 'https://time.geekbang.org/serv/v1/comments',
        baseUrl: 'https://time.geekbang.org/column/article/',
        outPath: '',              // 输出到本地路径，确保本路径存在
        courseName: '课程名称',          // 课程名称
        startArticleID: 1,                   // 专栏第一篇文章ID，在导出HTML文档时无用
        downloadAudio: false,                   // 是否下载音频
        downloadComment: false,                  // 是否下载评论
        cookie: '',
    },
    mongo: {
        host: '127.0.0.1',
        prot: '27017',
        username: null,
        passwd: null,
        dbname: 'geektime',
    }
}