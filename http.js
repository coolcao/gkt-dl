const request = require('request');
const config = require('./config');

const post = async (url, body, header) => {
    const headers = {
        'Content-Type': 'application/json',
        'Cookie': header && header.Cookie ? header.Cookie : config.geektime.cookie,
        'Referer': header && header.referer ? header.referer : config.geektime.url,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
    }

    return new Promise((resolve, reject) => {
        request({
            url,
            headers,
            body,
            method: 'POST',
            json: true,
        }, (error, response, body) => {
            if (error) {
                console.error(`error: http.js: post: ${error}`);
                reject(error);
            }
            if (response && response.statusCode != 200) {
                console.error(`error: http.js: post: ${response.statusCode}`);
                reject(`error: http.js: post: ${response.statusCode}`);
            }
            if (body && body.code != 0) {
                console.error(`error: http.js: post: ${body.error}`);
                reject(body.error);
            }
            resolve(body.data);

        });
    });

}

module.exports = {
    post,
}