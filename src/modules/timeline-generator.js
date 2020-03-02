/* eslint-disable no-undef */
const createLine = (relatorio, timeline, fromServer = true) => {
  const downloadAction = [
    ['fa-download', 'Baixar relatório', () => {
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(relatorio.relatorio));
      link.setAttribute('download', `${relatorio.name}.csv`);
      document.body.appendChild(link);
      link.click();
    }],
  ];
  const expireDate = fromServer ? relatorio.expireDate.sec : relatorio.expireDate;
  timeline.add(moment(moment.unix(expireDate)).subtract(7, 'day').unix(),
    relatorio.name,
    'O relatório só fica disponível por 7 dias após a solicitação.', downloadAction);
};

const timelineGenerator = (timeline, data) => {
  let relatorios = JSON.parse(data).data;
  console.log('Relatorios', relatorios);
  relatorios = relatorios.filter(relatorio => moment() < moment.unix(relatorio.expireDate.sec));
  localStorage.relatorios = true;
  relatorios.map(relatorio => createLine(relatorio, timeline));
};

export { timelineGenerator, createLine };
