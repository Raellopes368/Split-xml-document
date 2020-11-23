const fs = require("fs");
const { resolve } = require('path');
const readline = require("readline");
const cwd = __dirname;
let indexSave = 0;

async function readArq(arq) {
  return new Promise(async (resolver) => {
    let initConfig = "";
    let config = false;
    let archive = "";
    let completeArchive = "";
    let pages = 0;
    let name = arq.replace(".bz2", "");
    let archives = [];
    if(!(fs.existsSync(resolve(__dirname, 'dataset2')))){
      fs.mkdirSync(resolve(__dirname, 'dataset2'));
    }
    //abre o arquivo wikipedia.part_20.xml
    const rl = readline.createInterface({
      input: fs.createReadStream(resolve(__dirname, 'extracts', name))
    });
    // função que é executada a cada linha:
    rl.on("line", async line => {
      
      if (!config) {
        initConfig = initConfig.concat(line).concat("\n");
        if (line.match(/\<\/siteinfo\>/)) {
          config = true;
        }
      } else {
        if (pages <= 50000) {
          archive = archive.concat(line).concat("\n");
          if (line.match(/\<\/page\>/)) {
            pages++;
          }
          if (line.match(/\<\/mediawiki\>/)) {
            completeArchive = completeArchive
              .concat(initConfig + "<page>\n")
              .concat(archive);
            archives.push(completeArchive);
            pages = 0;
            completeArchive = "";
            archive = "";
          }
        } else {
          archive.concat(line).concat("\n");
          archive = archive.trim();
          if (archive.match(/^\<page\>/)) {
            completeArchive = completeArchive
              .concat(initConfig)
              .concat(archive + "</mediawiki>");
            archives.push(completeArchive);
            pages = 0;
            completeArchive = "";
            archive = "";
          } else {
            completeArchive = completeArchive
              .concat(initConfig)
              .concat("<page>\n" + archive + "</mediawiki>");
            archives.push(completeArchive);
            pages = 0;
            completeArchive = "";
            archive = "";
          }
        }
      }
    });
    
    rl.on('close', async () => {
      await saveAll(archives, 0);
      resolver();
    });

  });
}

async function save(arq) {
  console.log(`save wikipedia.part_${indexSave}.xml`)
  await fs.writeFileSync(
    cwd + "/dataset2/wikipedia.part_" + indexSave + ".xml",
    arq
  );
  indexSave ++;
}

async function saveAll(data, index){
  if(index === data.length) return;
  await save(data[index]);
  await saveAll(data, index + 1);
}

module.exports = async function readAll(data, index){
  if(index === data.length) return;
  await readOne(data[index]);
  await readAll(data, index + 1);
}






async function readOne(data){
  await readArq(data);
}

