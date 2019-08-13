const splitAt = require("split-at");
const fs = require("fs");
const readline = require("readline");
const cwd = __dirname;

async function readArq(arq) {
  return new Promise(async (resolve, reject) => {
    let configInicial = "";
    let config = false;
    let archive = "";
    let arquivoCompleto = "";
    let pages = 0;
    let arquivo = arq.replace(".bz2", "");
    let indice = 0;
    let arquivoGerado = "";
    //abre o arquivo wikipedia.part_20.xml
    const rl = readline.createInterface({
      input: fs.createReadStream(cwd + "/dataset2/" + arquivo)
    });
    // função que é executada a cada linha:
    let x = 0;
    rl.on("line", async line => {
      if (!config) {
        configInicial = configInicial.concat(line);
        if (line.match(/\<\/siteinfo\>/)) {
          config = true;
        }
      } else {
        if (pages <= 50000) {
          archive = archive.concat(line);
          if (line.match(/\<\/page\>/)) {
            pages++;
          }
          if (line.match(/\<\/mediawiki\>/)) {
            pages = 50001;
          }
        } else {
          arquivoCompleto += configInicial.concat(archive + "</mediawiki>");
          await salvaArquivo(arquivoCompleto, indice);
          arquivoCompleto = "";
          archive = "";
          indice++;
          pages = 0;
        }
      }
    });
    // evento executado após ler todas as linhas do arquivo:
    rl.on("close", () => {
      console.log("Arquivos gerados");
    });
  });
}

(async () => {
  await readArq("ptwiki-20190801-pages-articles-multistream4.xml");
})();

function salvaArquivo(arq, index) {
  return fs.writeFileSync(
    cwd + "/dataset2/wikipedia.part_" + index + ".xml",
    arq
  );
}

function abreLista() {
  let data = fs.readFileSync(__dirname + "/lista/lista.txt", "utf-8");
  return data;
}

const data = abreLista();
const lista = data.split(",");

// (async () => {
//   let x = 0;
//   for (const arquivo of lista) {
//     await geraArquivos(arquivo, x);
//     console.log(x);
//     x += 2;
//   }
// })();
