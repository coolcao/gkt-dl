const fs = require('fs');
const ejs = require('ejs');
const cheerio = require('cheerio');
const request = require('request');
const path = require('path');

const article = require('../article');
const tools = require('../tools')
const config = require('../config')

let articleTemplate = fs.readFileSync('./template/article.ejs', 'utf8');
// let articlesTemplate = fs.readFileSync('./template/articles.ejs', 'utf8');
let articlesTemplate = fs.readFileSync('./template/kindle.ejs', 'utf8');

const genreateOneHtml = async () => {
    const articles = await article.queryArticles();
    let out = config.geektime.outPath;
    let $ = null;
    if (articles.length > 0) {
        out = path.resolve(out, articles[0].course);
        if (!fs.existsSync(out)) {
            fs.mkdirSync(out)
        }

        // 下载图片
        for (let i=0;i<articles.length;i++) {
            $ = cheerio.load(articles[i].articleContent, {xmlMode: true});
            const imgEles = $('img');
            for (let j=0;j<imgEles.length;j++) {
                const item = imgEles[j];
                const imgSrc = item.attribs['src'];
                const imgNameSplits = imgSrc.split('/');
                const imgName = imgNameSplits[imgNameSplits.length - 1];
                request.head(imgSrc, function(error, res,body){
                    if(error){
                        console.log(error);
                        console.log('失败了')
                    }
                });
                //通过管道的方式用fs模块将图片写到本地的images文件下
                // const imagesPath = `${out}/images`;
                const imagesPath = path.resolve(out, 'images');
                if (!fs.existsSync(imagesPath)) {
                    fs.mkdirSync(imagesPath);
                }
                const imgOutPath = path.resolve(out, 'images', imgName);
                // if (!fs.existsSync(`${out}/images/${imgName}`)) {
                if (!fs.existsSync(imgOutPath)) {
                    console.log('正在下载图片：'+imgSrc);
                    await tools.downloadFile(imgSrc, imgOutPath);
                }
                item.attribs['src'] = `./images/${imgName}`;
            }
            articles[i].articleContent = $.html();
        }

        console.log('正在合成html文档...');
        const html = ejs.render(articlesTemplate, {articles: articles});
        const htmlOutPath = path.resolve(out, `${config.geektime.courseName}.html`);
        // fs.writeFileSync(`${out}/${config.geektime.courseName}.html`, html);
        fs.writeFileSync(htmlOutPath, html);
        console.log(`单一HTML文档已输出至:${htmlOutPath}`);
    }

}
const generateHTML = async () => {
    const articles = await article.queryArticles();
    let out = '/users/coolcao/';
    if (articles.length > 0) {
        out = out + articles[0].course;
        if (!fs.existsSync(out)) {
            fs.mkdirSync(out)
        }
        articles.forEach(a => {
            const html = ejs.render(articleTemplate, a)
            fs.writeFileSync(out + '/' + a.articleTitle + '.html', html)
        })
    }

}

(async function () {
    await genreateOneHtml();
})()

