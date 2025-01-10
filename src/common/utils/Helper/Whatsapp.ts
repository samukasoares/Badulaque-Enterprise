import { Orcamento } from "../Interfaces/Orcamento/Orcamento";
import { formatarDataExtenso } from "./Data";

export function gerarMensagemWhatsApp(orcamento: Orcamento, linkOrcamento: string): string {
    const detalhesOpcionais = orcamento.Orcamento_Opcional && orcamento.Orcamento_Opcional.length > 0
    ? `Opcionais: ${orcamento.Orcamento_Opcional.map((opcional, index) => 
        `*${opcional.Opcional.nomeOpcional}*${index < orcamento.Orcamento_Opcional.length - 1 ? ',' : ''}`
    ).join(' ')}`
    : '';

    const detalhesBar = orcamento.CardapioBar && orcamento.CardapioBar.nomeCardapioBar
    ? `Bar: *${orcamento.CardapioBar.nomeCardapioBar}*`
    : '';

    const linkCardapiosBar = orcamento.CardapioBar && orcamento.CardapioBar.nomeCardapioBar ? `Link para Cardápio do bar: https://bit.ly/cardapios-bardulaque` : '';

    const linkCardapioText = orcamento.Cardapio.linkCardapio 
    ? `Link para Cardápio solicitado: ${orcamento.Cardapio.linkCardapio}` 
    : ''; 

    return `*${orcamento.Lead.nomeLead}*
Me chamo ${localStorage.getItem('username')} e sejam bem-vindos à Badulaque Eventos✨!

Conforme solicitado, segue prévia do orçamento abaixo referente ao evento *${orcamento.tipoEvento}*, para *${formatarDataExtenso(orcamento.dataEvento)}* considerando *${orcamento.numConvidados}* convidados e os seguintes detalhes 👇🏻

Cardápio: *${orcamento.Cardapio.nomeCardapio}*  
Cerveja: *${orcamento.Cerveja.nome}*
${detalhesBar}
${detalhesOpcionais}

Link para Orçamento completo: ${linkOrcamento}
${linkCardapioText}
${linkCardapiosBar}

Caso deseje visualizar os detalhes de cada cardápio, envie "cardápios" no chat que todos os cardápios são enviados!
                        
Gostaríamos de convidá-los para uma visita ao nosso espaço, onde terão a oportunidade de vivenciar a primeira experiência de como é realizar este sonho conosco. 
Durante a visita, poderemos conversar mais detalhadamente sobre suas expectativas e planejar um evento personalizado e único, tornando esse dia ainda mais especial e inesquecível.

Veja os sonhos realizados na Badulaque através do nosso Instagram
https://www.instagram.com/badulaque_eventos/

Qual o melhor dia e horário para realizarmos uma visita? 😊`;
}