const generateCSVData = (data) => {
  const csvData = data.map(documento => [
    documento.document, documento.state.protestos, documento.state.ccf,
  ]);
  csvData.unshift(['Documento', 'Protestos', 'Cheques sem Fundos']);
  console.log('CSVData', data[0]);
  return csvData;
};

const csvGenerator = (data) => {
  const csvData = generateCSVData(data);
  const csvContent = `data:text/csv;charset=utf-8,${csvData.map(e => e.join(',')).join('\n')}`;
  console.log('CSV Content', csvContent);

  return csvContent;
};

export default csvGenerator;
