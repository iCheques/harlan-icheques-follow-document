import harlan from 'harlan';
import $ from 'jquery';
import { CPF, CNPJ } from 'cpf_cnpj';

harlan.addPlugin((controller) => {
  controller.registerCall('icheques::consulta::veiculos', (result, doc, veiculosButton) => controller.call('credits::has', 1000, () => controller.server.call('SELECT FROM \'VEICULOS\'.\'CONSULTA\'',
    controller.call('loader::ajax', controller.call('error::ajax',
      {
        data: {
          documento: doc.replace(/[^0-9]/g, ''),
        },

        success: (data) => {
          veiculosButton.remove();

          let firstCall = true;

          const veiculosNodes = $('veiculos registro', data);

          if (!data.spc.length) {
            controller.call('alert', {
              title: 'Não foram encontrados registros de Veículos',
              subtitle: 'O sistema não encontrou nenhum registro de Veículos para o documento informado.',
              paragraph: `Para o documento ${CPF.isValid(doc) ? CPF.format(doc) : CNPJ.format(doc)} não foram encontrados registros de Veículos.`,
            });
            return;
          }

          veiculosNodes.each((idx, element) => {
            const node = $(element);
            const separatorElement = result.addSeparator('Veículo Registrado no CPF/CNPJ',
              'Informações de Veículo Registrado no CPF/CNPJ.',
              'Dados de veículo automotor registrado na pessoa física ou jurídica.');

            if (firstCall) {
              $('html, body').animate({
                scrollTop: separatorElement.offset().top,
              }, 2000);
              firstCall = false;
            }

            const addItem = (name, value) => {
              const information = $(value, node).text();
              if (!information) return;
              result.addItem(name, information);
            };

            addItem('Placa', 'placa');
            addItem('Município', 'municipio');
            addItem('Estado', 'uf');
            addItem('Renavam', 'renavam');
            addItem('Chassi', 'chassi');
            addItem('Motor', 'motor');
            addItem('Ano de Fabricação', 'ano_fabricacao');
            addItem('Ano do Modelo', 'ano_modelo');
            addItem('Marca / Modelo', 'marca_modelo');
            addItem('Procedência', 'procedencia');
            addItem('Espécie', 'especie');
            addItem('Combustível', 'combustivel');
            addItem('Cor', 'cor');
          });
        },
      })))));

  controller.registerTrigger('ccbusca::parser', 'veiculos', ({ result, doc }, cb) => {
    let veiculosButton = null;
    veiculosButton = $('<button />')
      .text('Consultar Veículos')
      .addClass('button');

    veiculosButton.click(controller.click('icheques::consulta::veiculos', result, doc, veiculosButton));
    result.addItem().prepend(veiculosButton);
    cb();
  });
});
