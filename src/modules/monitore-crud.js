const listRelatorios = () => harlan.serverCommunication.call('SELECT FROM \'HarlanBateRapido\'.\'Relatorios\'', {
  dataType: 'json',
});

const insertRelatorio = relatorio => harlan.serverCommunication.call('INSERT INTO \'HarlanBateRapido\'.\'Relatorio\'', {
  data: {
    name: relatorio.name,
    relatorio: relatorio.relatorio,
    expireDate: relatorio.expireDate,
    total: relatorio.total,
  },
  dataType: 'json',
});

const getDocuments = async (documents) => {
  const serverCalls = {
    ccf: (documento) => harlan.serverCommunication.call(`SELECT FROM 'IEPTB'.'WS'`, {
      data: {
        documento
      },
      cache: 'DISABLED',
    }).then(result => parseInt(result.getElementsByTagName('registros')[0].textContent), error => 0),
    
    rfb: (documento) => harlan.serverCommunication.call(`SELECT FROM 'SEEKLOC'.'CCF'`, {
      data: {
        documento
      },
      cache: 'DISABLED',
    }).then(result => parseInt(result.getElementsByTagName('sumQteOcorrencias')[0].textContent), error => 0)
  }

  let promises = documents.map(async document => await Promise.all([serverCalls.ccf(document), serverCalls.rfb(document)]).then(
    states => {
      let obj = {
        document,
        state: {
          protestos: states[0],
          ccf: states[1]
        }
      };
      return obj;
  }));

  const data = await Promise.all(promises);

  return data;
}

export {
  insertRelatorio,
  listRelatorios,
  getDocuments,
};