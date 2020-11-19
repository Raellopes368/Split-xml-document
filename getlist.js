const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");

function getListDownloads(callback) {
  const url = process.argv[2];
  const arquivos = [];
  request(
    url,
    (error, response, body) => {
      const $ = cheerio.load(body);

      $("a").each(function() {
        if (
          $(this)
            .text()
            .includes(".bz2") &&
          $(this)
            .text()
            .match(".multistream") &&
          $(this)
            .text()
            .match(/xml\-p\d{1,}/)
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
}

getListDownloads(async lista => {
  await fs.writeFileSync(__dirname + "/lista/lista.txt", lista);
  console.log("Arquivo gerado lista.txt");
});
