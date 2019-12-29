const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const config = require('../config')
const article = require('../article')

// 每篇文章一个pdf
let articleTemplate = fs.readFileSync(path.resolve(__dirname, '../template/article.ejs'), 'utf8');

const generatePDF = async () => {
    console.log('正在生成pdf文件');
    let browser, page;
    let baseDir = config.geektime.outPath;
    let filePath;
    try {
        const articles = await article.queryArticles();
        browser = await puppeteer.launch();

        for (let i=0;i<articles.length;i++) {
            const a = articles[i];
            const html = ejs.render(articleTemplate, a);
            page = await browser.newPage();
            await page.setContent(html)
            filePath = path.resolve(baseDir, config.geektime.courseName);
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }
            await page.waitFor(5*1000);
            await page.pdf({path: path.resolve(filePath, a.articleTitle+'.pdf')});
            await page.close();
        }

        console.log('生成pdf完成');
        await browser.close();
    } catch (e) {
        console.error('生成pdf文件错误');
        console.error(e);
    }
}

(async function () {
    await generatePDF();
})();