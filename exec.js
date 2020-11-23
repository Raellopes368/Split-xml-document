require('dotenv').config();
const getUrl = require('./getUrl');
const getList = require('./getlist');
const downloads = require('./downloads');
const extract = require('./extract');
const split = require('./split');


async function run(){
  const urlConfig = process.env.URL;
  
  console.log('Buscando versão mais atualizada');
  const max = await getUrl();
  
  max.sort((a,b) => a < b);
  const url = `${urlConfig}${max[0]}`;
  
  console.log('Gerando lista para downloads');
  const data = await getList(url);
  
  console.log('Executando download');
  await downloads(data, data.length - 1, url);
  
  console.log('extraindo os arquivos');
  await extract(data, 0);
  
  console.log('Split nos arquivos');
  await split(data, 0);
}

run();
