/* eslint-disable no-undef */

const deleteDocument = document => harlan.serverCommunication.call('DELETE FROM \'FOLLOWDOCUMENT\'.\'DOCUMENT\'', {
  data: {
    documento: document,
  },
  dataType: 'json',
});


const insertDocument = document => harlan.serverCommunication.call('INSERT INTO \'FOLLOWDOCUMENT\'.\'DOCUMENT\'', {
  data: {
    documento: document,
  },
  dataType: 'json',
});


const listDocuments = () => harlan.serverCommunication.call('SELECT FROM \'FOLLOWDOCUMENT\'.\'LIST\'', {
  dataType: 'json',
});

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

export {
  insertDocument, listDocuments, deleteDocument, insertRelatorio, listRelatorios,
};
