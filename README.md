## 极客时间专栏导出工具

极客专栏上的文章质量都是极好的，但是只能在线或者使用app阅读。

对于那些喜欢使用kindle的小伙伴来说，想把专栏文章导到kindle中，不是很方便。

本工具提供了将专栏文章导出到静态html，然后再通过ebook-convert将html转换成需要的电子书格式即可。

注：使用前需要在配置文件中做一些配置，其中courseName和cookie是必须的，如果没有花钱购买专栏，那么也只能导出免费的章节。

为了方便导出，这里添加了mongo来存储中间结果，需要自行配置mongo。

## 需要配置的地方
### config.js
- outPath: 输出的本地目录
- courseName: 课程名称，输出到本地时会根据此课程名称创建本地目录
- startArticleID: 起始文章的id，在进行抓取时根据此文章id作为起始点
- cookie: 登录完成后的cookie
- mongo: mongodb配置


## 说明
定义三个脚本：
- `npm run 2mongo`: 爬取极客时间专栏文章到mongodb
- `npm run pdf`: 从mongodb获取文章并导出到pdf
- `npm run html`: 从mongodb获取文章并导出到html
