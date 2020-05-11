const generateCSVData = (data) => {
  const csvData = data.map(documento => [documento.documento, documento.protestos, documento.ccf])

  csvData.unshift(['Documento', 'Protestos', 'Cheques sem Fundos'])

  return csvData
};

const csvGenerator = (data) => {
  const csvData = generateCSVData(data);
  const csvContent = `data:text/csv;charset=utf-8,${csvData.map(e => e.join(',')).join('\n')}`;

  return csvContent;
};

export default csvGenerator;
