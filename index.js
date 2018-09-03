(function (harlan,$) {
  'use strict';

  harlan = harlan && harlan.hasOwnProperty('default') ? harlan['default'] : harlan;
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  harlan.addPlugin(function (controller) {
    controller.registerCall('icheques::consulta::veiculos', function (result, doc, veiculosButton) { return controller.call('credits::has', 1000, function () { return controller.server.call('SELECT FROM \'VEICULOS\'.\'CONSULTA\'',
      controller.call('loader::ajax', controller.call('error::ajax',
        {
          data: {
            documento: doc.replace(/[^0-9]/g, ''),
          },

          success: function (data) {
            veiculosButton.remove();

            var firstCall = true;

            $('veiculos registro', data).each(function (idx, element) {
              debugger;
              var node = $(element);
              var separatorElement = result.addSeparator('Veículo Registrado no CPF/CNPJ',
                'Informações de Veículo Registrado no CPF/CNPJ.',
                'Dados de veículo automotor registrado na pessoa física ou jurídica.');

              if (firstCall) {
                $('html, body').animate({
                  scrollTop: separatorElement.offset().top,
                }, 2000);
                firstCall = false;
              }

              var addItem = function (name, value) {
                var information = $(value, node).text();
                if (!information) { return; }
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
        }))); }); });

    controller.registerTrigger('ccbusca::parser', 'veiculos', function (ref, cb) {
      var result = ref.result;
      var doc = ref.doc;

      var veiculosButton = null;
      veiculosButton = $('<button />')
        .text('Consultar Veículos')
        .addClass('button');

      veiculosButton.click(controller.click('icheques::consulta::veiculos', result, doc, veiculosButton));
      result.addItem().prepend(veiculosButton);
      cb();
    });
  });

}(harlan,$));
