const request = require("request");
const cheerio = require("cheerio");
const { promisify } = require('util');

module.exports = function getListDownloads(url) {
  return new Promise(async (resolve, reject)=>{
    const data = [];
    try {
      const req = promisify(request);

      const { body } = await req(url);
      const cher = cheerio.load(body);
      cher('a').each( function(){
        const text = cher(this).text();
        if (text.includes(".bz2") &&
            text.match(".multistream") &&
            text.match(/xml\-p\d{1,}/) && 
            !text.match(/txt/)
          ) {
            data.push(text);
          }
          resolve(data);
      });

    } catch (error) {
      reject(error);
    }
  });
}

