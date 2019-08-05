/**
 *  Faz o download dos arquivos,descompacta e gera dois arquivos com a nomeação no formato wikipedia.part_x.xml
 */

const inly = require("inly");
const path = require("path");
const fs = require("fs");
const splitAt = require("split-at");
const cwd = __dirname;
const name =
  "ptwiki-20190801-pages-articles-multistream2.xml-p95101p442463.bz2";
const to = cwd + "/dataset2";
console.log(to);
const from = path.join(cwd + "/downloads", name);
const extract = inly(from, to);

extract.on("file", async name => {
  console.log("Arquivo descompactado " + name);
  await geraArquivos(name, process.argv[2]);
});

extract.on("progress", percent => {
  console.log(percent + "%");
});

extract.on("error", error => {
  console.error(error);
});

extract.on("end", () => {
  console.log("Concluido com sucesso ");
});

function readArq(arquivo) {
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

function geraArquivos(name, indice) {
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
  arquivos.forEach(e => {
    salvaArquivo(e, indice);
    console.log("Arquivo gerado wikipedia.part_" + indice + ".xml");
    indice += 1;
  });
}
