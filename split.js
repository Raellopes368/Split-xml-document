const splitAt = require("split-at");
const fs = require("fs");
const cwd = __dirname;

function readArq(arq) {
  let arquivo = arq.replace(".bz2", "");
  //abre o arquivo wikipedia.part_20.xml
  let data = fs.readFileSync(cwd + "/dataset2/" + arquivo, "utf-8");
  return data;
}
//Recebe o arquivo lido pelo fs

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

async function geraArquivos(name, indice) {
  const xml = readArq(name);
  //Pega o tamanho da metade
  const metade = xml.length / 2;
  //Separa em duas partes
  const parts = splitAt(xml, metade);
  console.log("Separando arquivo...");
  //Pega a parte onde foi dividida até o final da pagina
  const divisao = parts[1].split("</page>");
  //Acrescenta o fechamento da pagina
  divisao[0] = divisao[0].concat("</page>");
  //adiciona a primeira parte o fechamento da tag </mediawiki>
  const part1 = parts[0].concat(divisao[0]).concat("</mediawiki>");

  //Pega a primeira parte da configuração
  const configInicial = parts[0].split("</siteinfo>");
  //segunda parte
  let part2 = configInicial[0].concat("</siteinfo>").concat(parts[1]);
  const remove = parts[1].substring(0, divisao[0].length);
  part2 = part2.replace(remove, "");

  const arquivos = [];
  arquivos.push(part1);
  arquivos.push(part2);
  indice = parseInt(indice);
  await arquivos.forEach(e => {
    indice += 1;
    salvaArquivo(e, indice);
    console.log("Arquivo gerado wikipedia.part_" + indice + ".xml");
  });
}

const data = abreLista();
const lista = data.split(",");

(async () => {
  let x = 0;
  for (const arquivo of lista) {
    await geraArquivos(arquivo, x);
    console.log(x);
    x += 1;
  }
})();
