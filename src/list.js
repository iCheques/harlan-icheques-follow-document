/* eslint-disable no-nested-ternary */
import harlan from 'harlan';
import mapValues from 'lodash/mapValues';
import forEach from 'lodash/forEach';
import pickBy from 'lodash/pickBy';
import values from 'lodash/values';
import get from 'lodash/get';
import { CPF, CNPJ } from 'cpf_cnpj';
import sortBy from 'lodash/sortBy';
import $ from 'jquery';

const validFields = /[^\d\sa-z]/ig;

function normalizeSearch(str) {
  return str.replace(validFields, '').toLowerCase();
}

function beatifulJoin(arr, join = ', ', lastJoin = ' e ', endString = '.') {
  if (!arr.length) return '';
  if (arr.length === 2) return arr.join(lastJoin) + endString;
  if (arr.length === 1) return arr.pop() + endString;
  const lastElement = arr.pop();
  return [arr.join(join), lastElement].join(lastJoin) + endString;
}

function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

harlan.addPlugin((controller) => {
  controller.registerCall('followdocument::modal', () => {
    let skip = 0;
    let loadResults = null;
    const limit = 5;

    const modal = controller.call('modal');
    modal.title('Documentos Acompanhados');
    modal.subtitle('Abra ou remova documentos acompanhados');
    modal.addParagraph('Acompanhe e identifique os comportamentos de risco dos cedentes e sacados.');

    const form = modal.createForm();
    const search = form.addInput('username', 'text', 'Nome, CPF ou CNPJ do acompanhamento que procura.');

    let searchTimeout = null;
    search.keyup(() => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        searchTimeout = null;
      }
      searchTimeout = setTimeout(() => {
        if (loadResults) {
          loadResults();
        }
      }, 100);
    });

    const list = form.createList();
    const actions = modal.createActions();

    form.element().submit((e) => {
      e.preventDefault();
      controller.call('subaccount::create');
      modal.close();
    });

    actions.add('Sair').click((e) => {
      e.preventDefault();
      modal.close();
    });

    const [, protesto] = form.addCheckbox('protesto', 'Exibir apenas com protestos.', false, '1');
    const [, ccf] = form.addCheckbox('ccf', 'Exibir apenas com cheques sem fundo.', false, '1');
    const [, rfb] = form.addCheckbox('rfb', 'Exibir apenas com restrição na Receita Federal.', false, '1');

    rfb.change(() => {
      if (loadResults) loadResults();
    });

    protesto.change(() => {
      if (loadResults) loadResults();
    });

    ccf.change(() => {
      if (loadResults) loadResults();
    });

    const backPage = actions.add('Página Anterior').click(() => {
      skip -= limit;
      if (loadResults) loadResults();
    });

    const resultados = actions.observation('');
    const currentPage = actions.observation('');

    const nextPage = actions.add('Próxima Página').click(() => {
      skip += limit;
      if (loadResults) loadResults();
    });

    loadResults = () => {
      list.empty();
      const database = controller.call('followdocuments::database');
      const filterBy = {
        ...mapValues({ protesto, ccf, rfb }, element => element.is(':checked')),
        search: normalizeSearch(search.val()),
      };

      const items = sortBy(pickBy(database, (obj) => {
        if (filterBy.ccf && typeof obj.state.ccf === 'number' && obj.state.ccf <= 0) return false;
        if (filterBy.protesto && typeof obj.state.protestos === 'number' && obj.state.protestos <= 0) return false;
        if (filterBy.rfb && obj.markers.indexOf('rfb-invalid') === -1) return false;
        if (filterBy.search) {
          if (/^\d+$/.test(filterBy.search) && obj.document.indexOf(filterBy.search) === -1) return false;
          const name = get(filterBy, 'config.name');
          if (name && name.indexOf(normalizeSearch(filterBy.search)) === -1) return false;
        }
        return true;
      }), ({ state }) => values(state).reduce((c, d) => (c + d), 0) * -1);

      const total = Object.keys(items).length;
      if (!total) resultados.text('Não há resultados');
      else if (total === 1) resultados.text('1 resultado');
      else resultados.text(`${total} resultados`);

      while (skip && skip > total) skip -= limit;

      if (total <= limit) currentPage.hide();
      else {
        currentPage.show();
        currentPage.text(`Página ${skip ? Math.ceil(skip / limit) + 1 : 1} de ${Math.ceil(total / (limit * 1.0))}`);
      }

      if (skip + limit >= total) nextPage.hide();
      else nextPage.show();

      if (!skip) backPage.hide();
      else backPage.show();

      forEach(items.slice(skip, skip + limit), (item) => {
        const identificator = get(item, 'config.name',
          CPF.isValid(item.document) ? CPF.format(item.document) : CNPJ.format(item.document));

        const listItem = list.add([
          // 'fa-envelope-open',
          'fa-window-close',
        ], [identificator].concat([capitalize(beatifulJoin([
          (item.state.ccf === 0 ? ''
            : typeof item.state.ccf === 'undefined' ? 'processando cheques sem fundo'
              : item.state.ccf === 1 ? 'Um cheque sem fundo'
                : `${item.state.ccf} cheques sem fundo`),
          (item.state.protestos === 0 ? ''
            : typeof item.state.protestos === 'undefined' ? 'processando protestos'
              : item.state.protestos === 1 ? '1 protesto'
                : `${item.state.protestos} protestos`),
          (item.markers.indexOf('rfb-invalid') === -1 ? '' : 'restrição na Receita Federal'),
        ].filter(x => !!x))) || 'Sem cheque sem fundo ou protesto.']));

        $('.fa-envelope-open', listItem).click((e) => {
          e.preventDefault();
          controller.call('ccbusca', item.document, (sectionDocumentGroup) => {
            modal.close();
            $('.app-content').prepend(sectionDocumentGroup);
            $('html, body').scrollTop(sectionDocumentGroup.offset().top);
          });
        });

        $('.fa-window-close', listItem).click((e) => {
          e.preventDefault();
          controller.call('followdocuments::remove', item.document, () => {
            listItem.remove();
          })
        });
      });
    };

    loadResults();
  });
});
