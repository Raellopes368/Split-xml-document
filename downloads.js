const fs = require("fs");
const download = require("download");
const { resolve, join } = require('path');

async function Download(archive, url) {
  const data = await download(`${url.match(/\/$/) ? url : url + '/'}${archive}`);
  const path = resolve(__dirname, 'downloads');

  if(!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
  await fs.writeFileSync(join(path, archive), data);
  console.log('Download concluido, arquivo ' + archive);
  return archive;
}

module.exports = async function downloadAll(data, index, url){
  if(index < 0) return;

  await Download(data[index], url);
  console.log('Baixando próximo arquivo');
  await downloadAll(data, index -1, url);
}

// https://dumps.wikimedia.org/ptwiki