/* eslint-disable no-undef */
const createLine = (relatorio, timeline) => {
  const downloadAction = [
    ['fa-download', 'Baixar relatório', () => {
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(relatorio.link));
      link.setAttribute('download', `${relatorio.name}.csv`);
      document.body.appendChild(link);
      link.click();
    }],
  ];

  timeline.add(moment(relatorio.expireDate).subtract(1, 'day').unix(),
    relatorio.name,
    'O relatório só fica disponível por um dia após a solicitação.', downloadAxction);
};

const timelineGenerator = (timeline) => {
  let relatorios = JSON.parse(localStorage.relatorios);
  relatorios = relatorios.filter(relatorio => moment() < moment(relatorio.expireDate.sec));
  localStorage.relatorios = JSON.stringify(relatorios);
  relatorios.map(relatorio => createLine(relatorio, timeline));
};

export { timelineGenerator, createLine };
