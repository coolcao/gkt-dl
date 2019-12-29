const crypto = require('crypto');
const fs = require('fs');
const request = require('request');

// 获取字符串md5值
const getMd5 = (str) => {
    const md5 = crypto.createHash('md5');
    if (Object.prototype.toString.call(str) == '[object String]') {
        return  md5.update(str).digest('hex');
    }
    throw new Error('传值类型错误');
}

// 等待几秒
const waitSomeTimes = (second) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, second*1000);
    });
}

// 下载文件
const downloadFile = (url, out) => {
    return new Promise((resolve, reject) => {
        request(url).pipe(fs.createWriteStream(out)).on('finish', () => {
            resolve(true);
        }).on('error', (e) => {
            reject(e);
        });
    })
}

module.exports = {
    waitSomeTimes,
    getMd5,
    downloadFile,
}