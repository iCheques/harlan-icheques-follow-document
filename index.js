(function (harlan,numeral,$) {
	'use strict';

	harlan = harlan && harlan.hasOwnProperty('default') ? harlan['default'] : harlan;
	numeral = numeral && numeral.hasOwnProperty('default') ? numeral['default'] : numeral;
	$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var cpf = createCommonjsModule(function (module, exports) {
	(function(commonjs){
	  // Blacklist common values.
	  var BLACKLIST = [
	    "00000000000",
	    "11111111111",
	    "22222222222",
	    "33333333333",
	    "44444444444",
	    "55555555555",
	    "66666666666",
	    "77777777777",
	    "88888888888",
	    "99999999999",
	    "12345678909"
	  ];

	  var STRICT_STRIP_REGEX = /[.-]/g;
	  var LOOSE_STRIP_REGEX = /[^\d]/g;

	  var verifierDigit = function(numbers) {
	    numbers = numbers
	      .split("")
	      .map(function(number){ return parseInt(number, 10); })
	    ;

	    var modulus = numbers.length + 1;

	    var multiplied = numbers.map(function(number, index) {
	      return number * (modulus - index);
	    });

	    var mod = multiplied.reduce(function(buffer, number){
	      return buffer + number;
	    }) % 11;

	    return (mod < 2 ? 0 : 11 - mod);
	  };

	  var CPF = {};

	  CPF.format = function(number) {
	    return this.strip(number).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
	  };

	  CPF.strip = function(number, strict) {
	    var regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
	    return (number || "").toString().replace(regex, "");
	  };

	  CPF.isValid = function(number, strict) {
	    var stripped = this.strip(number, strict);

	    // CPF must be defined
	    if (!stripped) { return false; }

	    // CPF must have 11 chars
	    if (stripped.length !== 11) { return false; }

	    // CPF can't be blacklisted
	    if (BLACKLIST.indexOf(stripped) >= 0) { return false; }

	    var numbers = stripped.substr(0, 9);
	    numbers += verifierDigit(numbers);
	    numbers += verifierDigit(numbers);

	    return numbers.substr(-2) === stripped.substr(-2);
	  };

	  CPF.generate = function(formatted) {
	    var numbers = "";

	    for (var i = 0; i < 9; i++) {
	      numbers += Math.floor(Math.random() * 9);
	    }

	    numbers += verifierDigit(numbers);
	    numbers += verifierDigit(numbers);

	    return (formatted ? this.format(numbers) : numbers);
	  };

	  if (commonjs) {
	    module.exports = CPF;
	  } else {
	    window.CPF = CPF;
	  }
	})('object' !== "undefined");
	});

	var cnpj = createCommonjsModule(function (module, exports) {
	(function(commonjs){
	  // Blacklist common values.
	  var BLACKLIST = [
	    "00000000000000",
	    "11111111111111",
	    "22222222222222",
	    "33333333333333",
	    "44444444444444",
	    "55555555555555",
	    "66666666666666",
	    "77777777777777",
	    "88888888888888",
	    "99999999999999"
	  ];

	  var STRICT_STRIP_REGEX = /[-\/.]/g;
	  var LOOSE_STRIP_REGEX = /[^\d]/g;

	  var verifierDigit = function(numbers) {
	    var index = 2;
	    var reverse = numbers.split("").reduce(function(buffer, number) {
	      return [parseInt(number, 10)].concat(buffer);
	    }, []);

	    var sum = reverse.reduce(function(buffer, number) {
	      buffer += number * index;
	      index = (index === 9 ? 2 : index + 1);
	      return buffer;
	    }, 0);

	    var mod = sum % 11;
	    return (mod < 2 ? 0 : 11 - mod);
	  };

	  var CNPJ = {};

	  CNPJ.format = function(number) {
	    return this.strip(number).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
	  };

	  CNPJ.strip = function(number, strict) {
	    var regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
	    return (number || "").toString().replace(regex, "");
	  };

	  CNPJ.isValid = function(number, strict) {
	    var stripped = this.strip(number, strict);

	    // CNPJ must be defined
	    if (!stripped) { return false; }

	    // CNPJ must have 14 chars
	    if (stripped.length !== 14) { return false; }

	    // CNPJ can't be blacklisted
	    if (BLACKLIST.indexOf(stripped) >= 0) { return false; }

	    var numbers = stripped.substr(0, 12);
	    numbers += verifierDigit(numbers);
	    numbers += verifierDigit(numbers);

	    return numbers.substr(-2) === stripped.substr(-2);
	  };

	  CNPJ.generate = function(formatted) {
	    var numbers = "";

	    for (var i = 0; i < 12; i++) {
	      numbers += Math.floor(Math.random() * 9);
	    }

	    numbers += verifierDigit(numbers);
	    numbers += verifierDigit(numbers);

	    return (formatted ? this.format(numbers) : numbers);
	  };

	  if (commonjs) {
	    module.exports = CNPJ;
	  } else {
	    window.CNPJ = CNPJ;
	  }
	})('object' !== "undefined");
	});

	var cpf_cnpj = {
	  CPF: cpf,
	  CNPJ: cnpj
	};
	var cpf_cnpj_1 = cpf_cnpj.CPF;
	var cpf_cnpj_2 = cpf_cnpj.CNPJ;

	var isPlaca = /[a-z]{3}[0-9]{4}/i;

	harlan.addPlugin(function (controller) {
	  controller.registerCall('icheques::ichequesVeiculos::placa::parser', function (data, placa) {
	    var ref = controller.call('section', 'Pesquisa de Veículo',
	      ("Informações do veículo " + placa + " através da placa."),
	      'Informa dono, débitos e respectivos dados do veículo.');
	    var element = ref[0];
	    var body = ref[1];

	    var juntaEmpresaHTML = controller.call('xmlDocument', data, 'VEICULOS', 'PLACA');
	    juntaEmpresaHTML.find('.container').first().addClass('xml2html')
	      .data('document', $(data))
	      .data('form', [{
	        name: 'placa',
	        value: placa,
	      }]);

	    body.append(juntaEmpresaHTML);
	    $('.app-content').prepend(element);
	  });

	  controller.importXMLDocument.register('VEICULOS', 'PLACA', function (document) {
	    var main = $(document);
	    var result = controller.call('result');

	    var addSeparator = function () {
	      var args = [], len = arguments.length;
	      while ( len-- ) args[ len ] = arguments[ len ];

	      var title = args.shift();
	      var fields = args.pop();
	      var subtitle = args.shift();
	      var description = args.shift();

	      var items = fields
	        .map(function (ref) {
	          var query = ref[0];
	          var name = ref[1];
	          var fnc = ref[2];

	          return [name, main.find(query).text(), fnc];
	      })
	        .filter(function (ref) {
	          var content = ref[1];

	          return !!content;
	      });

	      if (!items.length) { return; }

	      result.addSeparator(title, subtitle, description);
	      items.forEach(function (ref) {
	        var name = ref[0];
	        var content = ref[1];
	        var fnc = ref[2];

	        return result.addItem(name, fnc ? fnc(content) : content);
	      });
	    };

	    addSeparator('Proprietário', 'Proprietário do Veículo', 'Dados do Proprietário do Veículo', [
	      ['proprietario cnpj_cpf', 'CNPJ CPF'],
	      ['proprietario nome', 'Nome']]);

	    addSeparator('Dados do Veículo', 'Dados de Identificação do Veículo', 'Dados para identificação rápida do veículo.', [
	      ['dados_do_veiculo ano_fabricacao', 'Ano de Fabricação'],
	      ['dados_do_veiculo ano_modelo', 'Ano Modelo'],
	      ['dados_do_veiculo capacidade_de_carga', 'Capacidade de Carga'],
	      ['dados_do_veiculo capacidade_maxtracao', 'Tração Máxima'],
	      ['dados_do_veiculo capacidade_passageiro', 'Capacidade de Passageiros'],
	      ['dados_do_veiculo categoria', 'Categoria'],
	      ['dados_do_veiculo chassi', 'Chassi'],
	      ['dados_do_veiculo cilindradas', 'Cilindradas'],
	      ['dados_do_veiculo cnpj_faturado', 'CNPJ Faturado'],
	      ['dados_do_veiculo codigo_marca', 'Código Marca'],
	      ['dados_do_veiculo combustivel', 'Combustível'],
	      ['dados_do_veiculo cor', 'Cor'],
	      ['dados_do_veiculo eixo_traseiro_diferencial', 'Eixo Traseiro Diferencial'],
	      ['dados_do_veiculo especie', 'Espécie'],
	      ['dados_do_veiculo marca', 'Marca'],
	      ['dados_do_veiculo municipio', 'Município'],
	      ['dados_do_veiculo nr_caixacambio', 'Número da Caixa de Câmbio'],
	      ['dados_do_veiculo nr_carroceria', 'Número da Carroceria'],
	      ['dados_do_veiculo numero_eixos', 'Número de Eixos'],
	      ['dados_do_veiculo numero_motor', 'Número Motor'],
	      ['dados_do_veiculo pesobruto_total', 'Peso Bruto Total'],
	      ['dados_do_veiculo placa', 'Placa'],
	      ['dados_do_veiculo potencia', 'Potência'],
	      ['dados_do_veiculo procedencia', 'Procedência'],
	      ['dados_do_veiculo renavam', 'Renavam'],
	      ['dados_do_veiculo situacao', 'Situação'],
	      ['dados_do_veiculo terceiro_eixo', 'Terceiro Eixo'],
	      ['dados_do_veiculo tipo', 'Tipo'],
	      ['dados_do_veiculo tipo_carroceria', 'Tipo Carroceria'],
	      ['dados_do_veiculo tipo_montagem', 'Tipo Montagem'],
	      ['dados_do_veiculo tipo_remarcacao', 'Tipo Remarcação'],
	      ['dados_do_veiculo uf', 'Estado'],
	      ['dados_do_veiculo uf_faturado', 'Estado do Faturamento'],
	      ['dados_do_veiculo ultima_atualizacao', 'Última Atualização']]);


	    addSeparator('Comunicação de Vendas', 'Presença de Comunicação de Vendas', 'Quando um veículo possui GRAVAME, o seu proprietário está impedido de preparar qualquer transferência.', [
	      ['comunicacao_de_vendas cnpj_cpf_comprador', 'CNPJ/CPF Comprador'],
	      ['comunicacao_de_vendas comunicacao_de_vendas', 'Comunicação de Vendas'],
	      ['comunicacao_de_vendas inclusao', 'Inclusão'],
	      ['comunicacao_de_vendas nota_fiscal', 'Nota Fiscal'],
	      ['comunicacao_de_vendas protocolo_detran', 'Detran'],
	      ['comunicacao_de_vendas tipo_doc_comprador', 'Tipo de Documento Comprador'],
	      ['comunicacao_de_vendas venda', 'Venda']]);

	    addSeparator('Proprietário Anterior', 'Proprietário Anterior do Veículo', 'Dados do Proprietário Anterior do Veículo', [
	      ['proprietario_anterior nome', 'Nome'] ]);

	    var money = function (x) { return numeral(x).format('$0,0.00'); };
	    addSeparator('Débitos e Multas', 'Débitos e Multas Pendentes', 'Débitos pendentes para garantir a regularidade do veículo e permitir seu licenciamento.', [
	      ['debitos_e_multas CETESB', 'CETESB', money],
	      ['debitos_e_multas DER', 'DER', money],
	      ['debitos_e_multas DERSA', 'DERSA', money],
	      ['debitos_e_multas DETRAN', 'DETRAN', money],
	      ['debitos_e_multas DPVAT', 'DPVAT', money],
	      ['debitos_e_multas IPVA', 'IPVA', money],
	      ['debitos_e_multas Licenciamento', 'Licenciamento', money],
	      ['debitos_e_multas Municipais', 'Municipais', money],
	      ['debitos_e_multas PRF', 'Polícia Rodoviária Federal', money],
	      ['debitos_e_multas Renainf', 'Renainf', money]]);

	    addSeparator('Restrições', 'Bloqueios e Restrições do Veículo', 'Lista de Restrições e Bloqueios do Veículo', [
	      ['restricoes bloqueio_guincho', 'Bloqueio Guincho'],
	      ['restricoes bloqueios_renajud', 'Bloqueio Guincho'],
	      ['restricoes inspecao_ambiental', 'Bloqueio Guincho'],
	      ['restricoes restricoes_administrativas', 'Bloqueio Guincho'],
	      ['restricoes restricoes_furto', 'Bloqueio Guincho'],
	      ['restricoes restricoes_judicial', 'Bloqueio Guincho'],
	      ['restricoes restricoes_tributaria', 'Restrições Tributárias'] ]);

	    addSeparator('Gravame', 'SNG - Sistema Nacional de Gravames', 'Quando um veículo possui GRAVAME, o seu proprietário está impedido de preparar qualquer transferência.', [
	      ['gravame agente_financeiro', 'Agente Financeiro'],
	      ['gravame cnpj_cpf_financiado', 'CNPJ CPF Financiado'],
	      ['gravame data_inclusao', 'Data de Inclusão'],
	      ['gravame nome_financiado', 'Nome Financiado'],
	      ['gravame restricao_financeira', 'Restrição Financeira'],
	      ['gravame tipo_transacao', 'Tipo de Transação'],
	      ['intencao_de_gravame intencao_de_gravame', 'Intenção de Gravame'],
	      ['intencao_de_gravame agente_financeiro', 'Agente Financeiro'],
	      ['intencao_de_gravame cnpj_cpf_financiado', 'CNPJ CPF Financiado'],
	      ['intencao_de_gravame data_inclusao', 'Data de Inclusão'],
	      ['intencao_de_gravame nome_do_financiado', 'Nome do Financiado'],
	      ['intencao_de_gravame restricao_financeira', 'Restrição Financeira'],
	      ['intencao_de_gravame intencao_de_gravame', 'Intenção de Gravame']]);


	    addSeparator('CRV e CRLV', 'Certificado de Registro do Veículo e Certificado de Registro e Licenciamento de Veículo',
	      'O CRV é entregue ao proprietário do veículo no momento em que é realizado o emplacamento.', [
	        ['crv_crvl_atualizacao data_emissao', 'Data de Emissão'],
	        ['crv_crvl_atualizacao exercicio_licenciamento', 'Exercício Licenciamento'],
	        ['crv_crvl_atualizacao licenciamento', 'Licenciamento']]);

	    return result.element();
	  });


	  controller.registerTrigger('findDatabase::instantSearch', 'ichequesVeiculos', function (args, callback) {
	    callback();
	    var argument = args[0];
	    var autocomplete = args[1];
	    if (!isPlaca.test(argument)) {
	      return;
	    }

	    autocomplete.item('Pesquisa de Veículos',
	      'Realiza uma consulta de veículos através da placa.',
	      'Informa dono do veículo, débitos e respectivo endereço.')
	      .addClass('admin-company admin-new-company')
	      .click(controller.click('icheques::ichequesVeiculos::placa', argument));
	  });

	  controller.registerCall('icheques::ichequesVeiculos::placa', function (placa) { return controller.server.call('SELECT FROM \'VEICULOS\'.\'placa\'',
	    controller.call('loader::ajax', controller.call('error::ajax',
	      {
	        data: { placa: placa },
	        success: function (data) { return controller.call('icheques::ichequesVeiculos::placa::parser', data, placa); },
	      }))); });

	  controller.registerCall('icheques::consulta::veiculos', function (result, doc, veiculosButton) { return controller.call('credits::has', 10000, function () { return controller.server.call('SELECT FROM \'VEICULOS\'.\'CONSULTA\'',
	    controller.call('loader::ajax', controller.call('error::ajax',
	      {
	        data: {
	          documento: doc.replace(/[^0-9]/g, ''),
	        },

	        success: function (data) {
	          veiculosButton.remove();

	          var firstCall = true;

	          var veiculosNodes = $('veiculos registro', data);

	          if (!veiculosNodes.length) {
	            controller.call('alert', {
	              title: 'Não foram encontrados registros de Veículos',
	              subtitle: 'O sistema não encontrou nenhum registro de Veículos para o documento informado.',
	              paragraph: ("Para o documento " + (cpf_cnpj_1.isValid(doc) ? cpf_cnpj_1.format(doc) : cpf_cnpj_2.format(doc)) + " não foram encontrados registros de Veículos."),
	            });
	            return;
	          }

	          veiculosNodes.each(function (idx, element) {
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

}(harlan,numeral,$));
