import harlan from 'harlan';
import numeral from 'numeral';
import $ from 'jquery';
import { CPF, CNPJ } from 'cpf_cnpj';

const isPlaca = /[a-z]{3}[0-9]{4}/i;

harlan.addPlugin((controller) => {
  controller.registerCall('icheques::ichequesVeiculos::placa::parser', (data, placa) => {
    const [element, body] = controller.call('section', 'Pesquisa de Veículo',
      `Informações do veículo ${placa} através da placa.`,
      'Informa dono, débitos e respectivos dados do veículo.');

    const juntaEmpresaHTML = controller.call('xmlDocument', data, 'VEICULOS', 'PLACA');
    juntaEmpresaHTML.find('.container').first().addClass('xml2html')
      .data('document', $(data))
      .data('form', [{
        name: 'placa',
        value: placa,
      }]);

    body.append(juntaEmpresaHTML);
    $('.app-content').prepend(element);
    $('html, body').animate({
      scrollTop: element.offset().top,
    }, 2000);
  });

  controller.importXMLDocument.register('VEICULOS', 'PLACA', (document) => {
    const main = $(document);
    const result = controller.call('result');

    const addSeparator = (...args) => {
      const title = args.shift();
      const fields = args.pop();
      const subtitle = args.shift();
      const description = args.shift();

      const items = fields
        .map(([query, name, fnc]) => [name, main.find(query).text(), fnc])
        .filter(([, content]) => !!content);

      if (!items.length) return;

      result.addSeparator(title, subtitle, description);
      items.forEach(([name, content, fnc]) => result.addItem(name, fnc ? fnc(content) : content));
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
      ['proprietario_anterior nome', 'Nome'],
    ]);

    const money = x => numeral(x).format('$0,0.00');
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
      ['restricoes restricoes_tributaria', 'Restrições Tributárias'],
    ]);

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


  controller.registerTrigger('findDatabase::instantSearch', 'ichequesVeiculos', (args, callback) => {
    callback();
    const [argument, autocomplete] = args;
    if (!isPlaca.test(argument)) {
      return;
    }

    autocomplete.item('Pesquisa de Veículos',
      'Realiza uma consulta de veículos através da placa.',
      'Informa dono do veículo, débitos e respectivo endereço.')
      .addClass('admin-company admin-new-company')
      .click(controller.click('icheques::ichequesVeiculos::placa', argument));
  });

  controller.registerCall('icheques::ichequesVeiculos::placa', placa => controller.call('credits::has', 10000, () => controller.server.call('SELECT FROM \'VEICULOS\'.\'placa\'',
    controller.call('loader::ajax', controller.call('error::ajax',
      {
        data: { placa },
        success: data => controller.call('icheques::ichequesVeiculos::placa::parser', data, placa),
      })))));

  controller.registerCall('icheques::consulta::veiculos', (result, doc, veiculosButton) => controller.call('credits::has', 10000, () => controller.server.call('SELECT FROM \'VEICULOS\'.\'CONSULTA\'',
    controller.call('loader::ajax', controller.call('error::ajax',
      {
        data: {
          documento: doc.replace(/[^0-9]/g, ''),
        },

        success: (data) => {
          veiculosButton.remove();

          let firstCall = true;

          const veiculosNodes = $('veiculos registro', data);

          if (!veiculosNodes.length) {
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
