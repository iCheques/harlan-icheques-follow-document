// eslint-disable-next-line no-undef
const deleteDocument = document => harlan.serverCommunication.call('DELETE FROM \'FOLLOWDOCUMENT\'.\'DOCUMENT\'', {
  data: {
    documento: document,
  },
  dataType: 'json',
});

// eslint-disable-next-line no-undef
const insertDocument = document => harlan.serverCommunication.call('INSERT INTO \'FOLLOWDOCUMENT\'.\'DOCUMENT\'', {
  data: {
    documento: document,
  },
  dataType: 'json',
});

// eslint-disable-next-line no-undef
const listDocuments = () => harlan.serverCommunication.call('SELECT FROM \'FOLLOWDOCUMENT\'.\'LIST\'', {
  dataType: 'json',
});

export { insertDocument, listDocuments, deleteDocument };
