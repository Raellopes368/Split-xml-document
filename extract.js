/**
 *  Faz o download dos arquivos,descompacta e gera dois arquivos com a nomeação no formato wikipedia.part_x.xml
 */

const inly = require("inly");
const path = require("path");
const fs = require("fs");
const cwd = __dirname;

async function extraiArquivo(name) {
  return new Promise(async (resolve, reject) => {
    const to = cwd + "/dataset2";
    const from = path.join(cwd + "/downloads", name);
    const extract = inly(from, to);

    extract.on("file", name => {
      console.log("Arquivo descompactado " + name);
    });

    extract.on("progress", percent => {
      console.log(percent + "%");
    });

    extract.on("error", error => {
      reject(error);
    });

    extract.on("end", () => {
      console.log("Concluido com sucesso ");
      resolve();
    });
  });
}
function abreLista() {
  let data = fs.readFileSync(__dirname + "/lista/lista.txt", "utf-8");
  return data;
}

const data = abreLista();
const lista = data.split(",");

(async () => {
  for (const arquivo of lista) {
    await extraiArquivo(arquivo);
  }
})();
