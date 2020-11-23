const inly = require("inly");
const { resolve } = require("path");
const fs = require("fs");

async function extractFile(name) {
  return new Promise(async (resolver) => {
    const path = resolve(__dirname, 'extracts');
    if(!fs.existsSync(path)){
      fs.mkdirSync(path);
    }

    const from = resolve(__dirname, 'downloads', name);
    const extract = inly(from, path);

    extract.on("end", () => {
      console.log("Concluido com sucesso ");
      resolver();
    });

  });
}
// function abreLista() {
//   let data = fs.readFileSync(__dirname + "/lista/lista.txt", "utf-8");
//   return data;
// }

// const data = abreLista();
// const lista = data.split(",");

// (async () => {
//   for (const arquivo of lista) {
//     await extraiArquivo(arquivo);
//   }
// })();


module.exports = async function extractAll(data, index){
  if(index === data.length) return;
  await extractFile(data[index]);
  await extractAll(data, index + 1);
}
