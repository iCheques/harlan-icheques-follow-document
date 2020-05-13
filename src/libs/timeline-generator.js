/* eslint-disable no-undef */
import csvGenerator from './csv-generator'

const createLineProcessing = (relatorio, timeline, fromServer = true) => {

  const downloadAction = [
    ['fa fa-spinner faa-spin animated', 'Baixar relatório', () => {
      console.log('Carregando')
    }],
  ];

  const creationDate = fromServer ? relatorio.created_at.sec : relatorio
    .created_at;

  timeline.add(creationDate,
    relatorio.name,
    'O relatório ficará disponível por 7 dias após a solicitação.',
    downloadAction);
};

const createLine = (relatorio, timeline, fromServer = true) => {
  const downloadAction = !relatorio.processing ? [
    ['fa-download', 'Baixar relatório', () => {
      const link = document.createElement('a');
      link.setAttribute('href', `https://baterapido.credithub.com.br/relatorio/${relatorio._id.$id}/${harlan.confs.user.apiKey}`);
      link.setAttribute('download', `${relatorio.name}.csv`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
    }],
    ['fa-trash', 'Remover Relatório', () => {
      const modal = harlan.call('modal');
      modal.title('Remover relatório');
      modal.paragraph(
        'Você tem certeza que deseja remover esse relatório?');
      const form = modal.createForm();
      form.element().submit((e) => {
        e.preventDefault();
        modal.close();
        const query =
        'DELETE FROM \'HARLANBATERAPIDO\'.\'RELATORIO\'';
        console.log('relatorio', relatorio);
        harlan.serverCommunication.call(query,
          harlan.call('error::ajax', harlan.call('loader::ajax', {
            data: {
              id: relatorio["_id"]['$id'],
            },
            dataType: 'json',
            success(ret) {
              $(`li:contains(${relatorio.name})`).remove();
              toastr.success('Relatório removido com sucesso!');
            },
          })));
      });
      form.addSubmit('deletar-relatorio', 'Remover Relatório');
      modal.createActions().cancel();
    }],
  ] : [
    ['fa fa-spinner faa-spin animated', 'Relatório sendo processado...', () => {
      console.log('Carregando')
    }],
  ];
  const creationDate = fromServer ? relatorio.created_at.sec : relatorio.created_at;
  timeline.add(creationDate,
    relatorio.name,
    'O relatório só fica disponível por 7 dias após a solicitação.',
    downloadAction);
};

const timelineGenerator = (timeline, data) => {
  let relatorios = data;
  console.log('Relatorios', relatorios);
  relatorios.map(relatorio => createLine(relatorio, timeline));
};

export {
  timelineGenerator,
  createLine
};
