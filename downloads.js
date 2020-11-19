const fs = require("fs");
const download = require("download");

// function Download(arquivo) {
//   download("https://dumps.wikimedia.org/ptwiki/20190801/" + arquivo).then(
//     data => {
//       fs.writeFileSync(__dirname + "/downloads/" + arquivo, data);
//       console.log("Download concluido, arquivo " + arquivo);
//     }
//   );
// }
async function Download(arquivo) {
  const url = process.argv[2];
  const data = await download(
    url + '/' + arquivo
  );
  await fs.writeFileSync(__dirname + "/downloads/" + arquivo, data);
  console.log("Download concluido, arquivo " + arquivo);
  return arquivo;
}

function abreLista() {
  let data = fs.readFileSync(__dirname + "/lista/lista.txt", "utf-8");
  return data;
}

const data = abreLista();
const lista = data.split(",");

(async () => {
  for (const arquivo of lista) {
    await Download(arquivo);
    console.log("Baixando o próximo arquivo!");
  }
})();
