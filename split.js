const fs = require("fs");
const readline = require("readline");
const cwd = __dirname;

async function readArq(arq) {
  return new Promise(async () => {
    let configInicial = "";
    let config = false;
    let archive = "";
    let arquivoCompleto = "";
    let pages = 0;
    let arquivo = arq.replace(".bz2", "");
    let arquivos = [];
    //abre o arquivo wikipedia.part_20.xml
    const rl = readline.createInterface({
      input: fs.createReadStream(cwd + "/dataset2/" + arquivo)
    });
    // função que é executada a cada linha:
    rl.on("line", async line => {
      if (!config) {
        configInicial = configInicial.concat(line).concat("\n");
        if (line.match(/\<\/siteinfo\>/)) {
          config = true;
        }
      } else {
        if (pages <= 30000) {
          archive = archive.concat(line).concat("\n");
          if (line.match(/\<\/page\>/)) {
            pages++;
          }
          if (line.match(/\<\/mediawiki\>/)) {
            console.log(
              "O arquivo foi lido com sucesso , gerando arquivos ..."
            );
            arquivoCompleto = arquivoCompleto
              .concat(configInicial + "<page>\n")
              .concat(archive);
            arquivos.push(arquivoCompleto);
            pages = 0;
            arquivoCompleto = "";
            archive = "";
          }
        } else {
          archive.concat(line).concat("\n");
          archive = archive.trim();
          if (archive.match(/^\<page\>/)) {
            arquivoCompleto = arquivoCompleto
              .concat(configInicial)
              .concat(archive + "</mediawiki>");
            arquivos.push(arquivoCompleto);
            pages = 0;
            arquivoCompleto = "";
            archive = "";
          } else {
            arquivoCompleto = arquivoCompleto
              .concat(configInicial)
              .concat("<page>\n" + archive + "</mediawiki>");
            arquivos.push(arquivoCompleto);
            pages = 0;
            arquivoCompleto = "";
            archive = "";
          }
        }
      }
    });
    const parte = process.argv[2];
    const partes = parte.split(".");
    let indice = parseInt(partes[1]);
    // evento executado após ler todas as linhas do arquivo:
    rl.on("close", async () => {
      for (let arquivo of arquivos) {
        await salvaArquivo(arquivo, indice);
        console.log("Um arquivo gerado wikipedia.part_" + indice + ".xml");
        console.log("Com um tamanho de " + arquivo.length + " caracteres");
        indice++;
      }
    });
  });
}

async function salvaArquivo(arq, index) {
  await fs.writeFileSync(
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

const parte = process.argv[2];
const partes = parte.split(".");

const arquivo = parseInt(partes[0]);
const indice = parseInt(partes[1]);
let x = 0;
(async () => {
  await readArq(lista[arquivo], indice);
})();
