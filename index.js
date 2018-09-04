(function (harlan,$) {
	'use strict';

	harlan = harlan && harlan.hasOwnProperty('default') ? harlan['default'] : harlan;
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

	          var veiculosNodes = $('veiculos registro', data);

	          if (!data.spc.length) {
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

}(harlan,$));
