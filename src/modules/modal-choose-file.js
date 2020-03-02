/* eslint-disable no-undef */
import { hasCredits } from './has-credits';
import { insertDocument, listDocuments, deleteDocument } from './monitore-crud';


const modalChooseFile = (controller) => {
  const modal = controller.call('modal');

  modal.title('Bate rápido');
  modal.subtitle('Escolha o documento csv para gerar o relatório');

  const form = modal.createForm();
  const input = form.addInput('documento-csv', 'file', 'Escolha o documento');
  console.log(input.val());

  form.element().submit((e) => {
    e.preventDefault();

    const myFile = $(input)[0].files[0];
    const reader = new FileReader(myFile);
    reader.readAsText(myFile);

    const documents = reader.result.filter(doc => !$.isEmptyObject(doc));
    documentos = documents.map(doc => doc.replace(/[^0-9]+/g, ''));

    hasCredits(500 * documentos.length, () => {
      const insertDocumentPromises = documentos.map(insertDocument);
      Promise.all(insertDocumentPromises).then(listDocuments().then((documentsData) => {
        documentos.forEach(deleteDocument);
      }));
    });
  });

  form.addSubmit('submit', 'Gerar Relatório').addClass('credithub-button');
  modal.createActions().cancel();
};

export default modalChooseFile;
