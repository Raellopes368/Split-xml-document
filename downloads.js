const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request");

function download(arquivo) {
  request("https://dumps.wikimedia.org/ptwiki/20190801/" + arquivo).pipe(
    fs.createWriteStream("./downloads/" + arquivo)
  );
}

const getListDownloads = async callback => {
  const arquivos = [];
  request(
    "https://dumps.wikimedia.org/ptwiki/20190801/",
    (error, response, body) => {
      const $ = cheerio.load(body);

      $("a").each(function() {
        if (
          $(this)
            .text()
            .includes(".bz2")
        ) {
          if (
            !$(this)
              .text()
              .includes("txt")
          ) {
            arquivos.push($(this).text());
          }
        }
      });
      callback(arquivos);
    }
  );
};

getListDownloads(lista => {
  console.log(lista);
  //download(lista[posição])
});
