import {
    imgVirus
} from "./img";

const auxilioCovidAtivado = () => {
    const modal = harlan.call('modal');

    modal.title('AUXÍLIO COVID-19');
    modal.subtitle('AUXÍLIO ATIVADO COM SUCESSO!');
    const p = modal.paragraph('Parabéns! O Auxílio COVID-19 foi ativado com sucesso e você poderá utilizar até o dia 31/maio!');
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
    button1.insertAfter(p);
    button1[0].onclick = () => {
        modal.close();
        $('#monitorar-documento').click()
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
    button2.insertAfter(button1);
    button2[0].onclick = () => {
        modal.close();
        $('#send-csv').click()
    };

    modal.createActions().cancel();
}
/**
 * Exibe o modal do auxilílio monitore
 */
export const auxilioCovid = () => {
    const modal = harlan.call('modal');

    modal.title('AUXÍLIO COVID-19');
    modal.subtitle('AUXILIO FACTORING GRÁTIS');
    
    const paragraph = modal.paragraph('Devido ao cenário pandêmico do CORONAVIRUS, milhares de boletos estão sendo prorrogados ou vencendo. Fazer a cobrança na hora errada pode causar transtornos, gastar tempo além de trazer prejuízos inestimáveis. Com o Monitore fica fácil saber quando o sacado inadimplente recebe capital e está pagando suas dívidas para então cobrá-lo das suas. Não seja o ultimo na fila de recebimento! Receba alertas por e-mail quando o sacado que te deve começar a pagar dívidas. Grátis até o 31 de maio, favor consultar os termos antes de começar.');

    const form = modal.createForm();
    const inputAgree = form.addCheckbox('agree', 'Eu li e aceito os <a href="https://drive.google.com/file/d/1fKSNgqgaSgh1D32a5MlEEkdZiGmxm2tO/view" target="_blank">TERMOS DO AUXILIO COVID.', false);

    form.addSubmit('login', 'Ativar');
    form.element().submit(ev => {
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
                    auxilioCovidAtivado();
                }
            })));
    });
    modal.createActions().cancel();

    const $img = $($.parseHTML(imgVirus())).css({
        float: 'left',
        width: '166px',
        marginLeft: '19px',
        marginTop: '10px'
    });

    const $virus = $('<div>').css({
        backgroundColor: '#a91d09',
        borderRadius: '100px',
        height: '12rem',
        width: '200px',
        float: 'left',
        marginRight: '30px'
    }).append($img)

    $virus.insertBefore($('h2:contains(COVID-19)'));
}