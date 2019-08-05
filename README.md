Primeiro criar uma pasta chamada downloads e outra dataset2 executar downloads.js ,
vai retornar uma lista com todos os arquivos para download,
após isso,descomente download(lista[posicao]) e passe a posição 
do arquivo que deseja fazer o download.
Após o download concluido,execute o index.js passando um numero como paramentro ,
por exemplo  "node node --max-old-space-size=4096 index.js 0", onde o parametro vai ser o indice de um dos arquivos que irá gerar, o outro vai ser o incremento desse numero ,nesse caso irá gerar dois arquivos ,um chamado "wikipedia.part_0.xml" e o outro de "wikipedia.part_1.xml". 
