const getList = require('./getlist');
const downloads = require('./downloads');
const extract = require('./extract');
const split = require('./split2');

const url = process.argv[2];

async function run(){
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
