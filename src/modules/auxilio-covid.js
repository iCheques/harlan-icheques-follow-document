/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import $ from 'jquery';
import harlan from 'harlan';
import toastr from 'toastr';
import {
  imgVirus,
} from './img';

const auxilioCovidAtivadoDuplicatas = (firstTime = true) => {
  const message = firstTime ? {
    subtitle: 'AUXÍLIO ATIVADO COM SUCESSO!',
    paragraph: 'Parabéns! O Auxílio COVID-19 foi ativado com sucesso e você poderá utilizar até o dia 30/julho!',
  } : {
    subtitle: 'AUXÍLIO JÁ ESTÁ ATIVADO!',
    paragraph: 'O seu Auxílio COVID-19 já foi ativado com sucesso e você já pode utilizá-lo!',
  };
  const modal = harlan.call('modal');

  modal.title('AUXÍLIO COVID-19');
  modal.subtitle(message.subtitle);
  modal.createActions().cancel();
};
const auxilioCovidAtivado = (firstTime = true) => {
  const message = firstTime ? {
    subtitle: 'AUXÍLIO ATIVADO COM SUCESSO!',
    paragraph: 'Parabéns! O Auxílio COVID-19 foi ativado com sucesso e você poderá utilizar até o dia 30/julho!',
  } : {
    subtitle: 'AUXÍLIO JÁ ESTÁ ATIVADO!',
    paragraph: 'O seu Auxílio COVID-19 já foi ativado com sucesso e você já pode utilizá-lo!',
  };
  const modal = harlan.call('modal');

  modal.title('AUXÍLIO COVID-19');
  modal.subtitle(message.subtitle);
  const p = modal.paragraph(message.paragraph);
  const d = $('<div>').css('text-align', 'center').insertAfter(p);
  const button1 = $($.parseHTML(`<button style="
    display: inline-block;
    width: auto;
    box-shadow: none;
    text-align: center;
    border: none;
    background-color: #fdad30;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    transition: background-color .2s ease-in;
    margin: 10px 10px 0;
">Monitorar Documento</button>`));
  button1.appendTo(d);
  button1[0].onclick = () => {
    modal.close();
    $('#monitorar-documento').click();
  };

  const button2 = $($.parseHTML(`<button style="
    display: inline-block;
    width: auto;
    box-shadow: none;
    text-align: center;
    border: none;
    background-color: #0186ef;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    transition: background-color .2s ease-in;
    margin: 10px 10px 0;
">Enviar Arquivo CSV</button>`));
  button2.appendTo(d);
  button2[0].onclick = () => {
    modal.close();
    $('#send-csv').click();
  };

  modal.createActions().cancel();
};
const auxilioCovidDesativado = (firstTime = true, manterDocumentos = false) => {
  const message = firstTime ? {
    paragraph: 'O Auxílio Monitore foi desativado!',
  } : {
    paragraph: 'Houve algum erro e não foi possível desativar seu monitore. (Caso tenha escolhido manter os documentos, por favor verifique se possui saldo suficiente para a operação.)',
  };

  if (manterDocumentos) message.paragraph = 'O Auxílio Monitore foi desativado e seus documentos monitorados foram mantidos!';

  const modal = harlan.call('modal');

  modal.title('AUXÍLIO MONITORE ILIMITADO');
  modal.paragraph(message.paragraph);

  modal.createActions().cancel();
};
/**
 * Auxilio Duplicatas
 */
const auxilioDuplicatas = () => {
  const modal = harlan.call('modal');

  modal.title('AUXÍLIO COVID-19');
  modal.subtitle('AUXILIO Protesto + CCF para Duplicatas');

  modal.paragraph('Devido ao cenário pandêmico e a volta das operações de crédito, decidimos estender mais uma gratuidade para as Financeiras. Agora poderão analisar suas operações SEM CUSTO nessa época de sofrimento. Independente de quando retornam, ative seu Auxilio Covid para suas Duplicatas por um mês. Deixe a analise conosco e minimize seus custos operacionais.');

  const form = modal.createForm();
  const inputAgree = form.addCheckbox('agree', 'Eu li e aceito os <a href="https://drive.google.com/file/d/1HFNQd9AuExwx2vH3Pr3dc0VwqYDjB87D/view" target="_blank">TERMOS DO AUXILIO Protesto + CCF para Duplicatas.', false);
  const souFinanceira = form.addCheckbox('agree', 'Sou uma Factoring, FIDC, Securitizadora ou ESC.', false);

  form.addSubmit('login', 'Ativar');
  form.element().submit((ev) => {
    ev.preventDefault();

    if (!inputAgree[1].is(':checked')) return toastr.warning('É preciso aceitar os termos para prosseguir!');
    if (!souFinanceira[1].is(':checked')) return toastr.warning('É preciso ser uma financeira para prosseguir!');
    harlan.serverCommunication.call('SELECT FROM \'HARLAN\'.\'ActiveDuplicatasPromo\'',
      harlan.call('error::ajax', harlan.call('loader::ajax', {
        dataType: 'json',
        success: () => {
          modal.close();
          auxilioCovidAtivadoDuplicatas();
        },
        error: () => {
          auxilioCovidAtivadoDuplicatas(false);
        },
      })));
  });
  modal.createActions().cancel();

  const $img = $($.parseHTML(imgVirus())).css({
    float: 'left',
    width: '166px',
    marginLeft: '19px',
    marginTop: '10px',
  });

  const $virus = $('<div>').css({
    backgroundColor: '#a91d09',
    borderRadius: '100px',
    height: '12rem',
    width: '200px',
    float: 'left',
    marginRight: '30px',
  }).append($img);

  $virus.insertBefore($('h2:contains(COVID-19)'));
};

/**
 * Auxilio Monitore
 */
const auxilioMonitore = () => {
  const modal = harlan.call('modal');

  modal.title('AUXÍLIO COVID-19');
  modal.subtitle('AUXILIO FACTORING GRÁTIS');

  modal.paragraph('Devido ao cenário pandêmico do CORONAVIRUS, milhares de boletos estão sendo prorrogados ou vencendo. Fazer a cobrança na hora errada pode causar transtornos, gastar tempo além de trazer prejuízos inestimáveis. Com o Monitore fica fácil saber quando o sacado inadimplente recebe capital e está pagando suas dívidas para então cobrá-lo das suas. Não seja o ultimo na fila de recebimento! Receba alertas por e-mail quando o sacado que te deve começar a pagar dívidas. Grátis até o 31 de maio, favor consultar os termos antes de começar.');

  const form = modal.createForm();
  const inputAgree = form.addCheckbox('agree', 'Eu li e aceito os <a href="https://drive.google.com/file/d/1OmR2jEDssp-6cVd8Jc-5qatblAZiBa7i/view" target="_blank">TERMOS DO AUXILIO COVID.', false);

  form.addSubmit('login', 'Ativar');
  form.element().submit((ev) => {
    ev.preventDefault();

    if (!inputAgree[1].is(':checked')) return toastr.warning('É preciso aceitar os termos para prosseguir!');
    harlan.serverCommunication.call('SELECT FROM \'HARLAN\'.\'ActiveMonitorePromo\'',
      harlan.call('error::ajax', harlan.call('loader::ajax', {
        dataType: 'json',
        success: () => {
          modal.close();
          $('#auxilio-covid19-monitore').remove();
          $('#auxilio-topbar').remove();
          auxilioCovidAtivado();
        },
        error: () => {
          $('#auxilio-covid19-monitore').remove();
          $('#auxilio-topbar').remove();
          auxilioCovidAtivado(false);
        },
      })));
  });
  modal.createActions().cancel();

  const $img = $($.parseHTML(imgVirus())).css({
    float: 'left',
    width: '166px',
    marginLeft: '19px',
    marginTop: '10px',
  });

  const $virus = $('<div>').css({
    backgroundColor: '#a91d09',
    borderRadius: '100px',
    height: '12rem',
    width: '200px',
    float: 'left',
    marginRight: '30px',
  }).append($img);

  $virus.insertBefore($('h2:contains(COVID-19)'));
};

const cancelarAuxilioMonitore = () => {
  const modal = harlan.call('modal');
  modal.title('AUXÍLIO COVID-19');
  modal.subtitle('Antes de efetuarmos o cancelamento, você deseja apagar todos os CPF/CNPJs monitorados ou gostaria de deixar por R$1,00 por mês cada?');


  const form = modal.createForm();
  form.addSubmit('desativar-monitore', 'Cancelar e manter os documentos monitorados').on('click', (ev) => {
    ev.preventDefault();
    harlan.serverCommunication.call('SELECT FROM \'HARLAN\'.\'DeactivateMonitorePromo\'',
      harlan.call('error::ajax', harlan.call('loader::ajax', {
        dataType: 'json',
        data: {
          manterDocumentos: 'active',
        },
        success: () => {
          modal.close();
          $('#auxilio-covid19-monitore').remove();
          $('#auxilio-topbar').remove();
          auxilioCovidDesativado(true, true);
        },
        error: () => {
          modal.close();
          $('#auxilio-covid19-monitore').remove();
          $('#auxilio-topbar').remove();
          auxilioCovidDesativado(false);
        },
      })));
  });

  form.addSubmit('desativar-monitore', 'Confirmar desativação do Monitore Ilimitado e EXCLUIR documentos monitorados').on('click', (ev) => {
    ev.preventDefault();
    harlan.serverCommunication.call('SELECT FROM \'HARLAN\'.\'DeactivateMonitorePromo\'',
      harlan.call('error::ajax', harlan.call('loader::ajax', {
        dataType: 'json',
        data: {
          manterDocumentos: 'disabled',
        },
        success: () => {
          modal.close();
          $('#auxilio-covid19-monitore').remove();
          $('#auxilio-topbar').remove();
          auxilioCovidDesativado();
        },
        error: () => {
          modal.close();
          $('#auxilio-covid19-monitore').remove();
          $('#auxilio-topbar').remove();
          auxilioCovidDesativado(false);
        },
      })));
  });
  const $img = $($.parseHTML(imgVirus())).css({
    float: 'left',
    width: '166px',
    marginLeft: '19px',
    marginTop: '10px',
  });

  modal.createActions().cancel();

  const $virus = $('<div>').css({
    backgroundColor: '#a91d09',
    borderRadius: '100px',
    height: '12rem',
    width: '200px',
    float: 'left',
    marginRight: '30px',
  }).append($img);

  $virus.insertBefore($('h2:contains(COVID-19)'));
};
/**
 * Exibe o modal do auxilílio monitore
 */
export const auxilioCovid = () => {
  const modal = harlan.call('modal');
  modal.title('AUXÍLIO COVID-19');
  modal.subtitle('Criamos algumas gratuidades para ajudar neste momento de pandemia');

  const form = modal.createForm();

  form.addSubmit('auxilio-duplicatas', 'Protesto + CCF para Duplicatas (Somente Financeiras)').on('click', (ev) => {
    ev.preventDefault();
    modal.close();
    auxilioDuplicatas();
  });

  modal.createActions().add('Desativar Auxilio Monitore Ilimitado').on('click', (ev) => {
    ev.preventDefault();
    modal.close();
    cancelarAuxilioMonitore();
  });
  modal.createActions().cancel();
};
