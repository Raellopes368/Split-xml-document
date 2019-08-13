const splitAt = require("split-at");
const fs = require("fs");
const readline = require("readline");
const cwd = __dirname;

async function readArq(arq) {
  return new Promise(async (resolve, reject) => {
    let configInicial = "";
    let totalPage = 0;
    let totalArquivo = 1;
    let config = false;
    let archive = "";
    let arquivoCompleto = "";
    let pages = 0;
    let arquivo = arq.replace(".bz2", "");
    let indice = 0;
    let arquivos = [];
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
        if (pages <= 100000) {
          archive = archive.concat(line);
          if (line.match(/\<\/page\>/)) {
            pages++;
            totalPage++;
          }
          if (line.match(/\<\/mediawiki\>/)) {
            console.log("Arquivo chegou ao final e foi salvo");
            arquivoCompleto = arquivoCompleto
              .concat(configInicial)
              .concat(archive + "</mediawiki>");
            arquivos.push(arquivoCompleto);
            pages = 0;
            arquivoCompleto = "";
            archive = "";
          }
        } else {
          arquivoCompleto = arquivoCompleto
            .concat(configInicial)
            .concat(archive + "</mediawiki>");
          arquivos.push(arquivoCompleto);
          pages = 0;
          console.log("pagina " + totalArquivo);
          totalArquivo++;
          arquivoCompleto = "";
          archive = "";
          return false;
        }
      }
    });
    // evento executado após ler todas as linhas do arquivo:
    rl.on("close", async () => {
      console.log(totalPage);
      for (let arquivo of arquivos) {
        await salvaArquivo(arquivo, indice);
        console.log("Um arquivo gerado wikipedia.part_" + indice + ".xml");
        console.log("Com um tamanho de " + arquivo.length);
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

(async () => {
  let x = 0;
  for (const arquivo of lista) {
    await geraArquivos(arquivo, x);
    x += 5;
  }
})();
