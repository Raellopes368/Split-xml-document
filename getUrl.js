require('dotenv').config();
const request = require("request");
const cheerio = require("cheerio");
const { promisify } = require('util');

 module.exports = function getUrl() {
  return new Promise(async (resolve, reject)=>{
    const geralUrl = process.env.URL;
    const data = [];
    
    try {
      const req = promisify(request);
      const { body } = await req(geralUrl);
      const cher = cheerio.load(body);
      cher('a').each( function(){
        const text = cher(this).text();
        if(text.match(/[\d]/)){
          data.push(Number(text.replace(/\//,'')));
        }
       
        resolve(data);
      });

    } catch (error) {
      reject(error);
    }
  });
}

