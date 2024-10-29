import { formatarValorMonetario } from "../Helper";
import { Orcamento } from "../Interfaces/Orcamento";
import { formatarDataExtenso } from "./Data";

export function gerarMensagemWhatsApp(orcamento: Orcamento, linkOrcamento: string): string {
    const detalhesOpcionais = orcamento.Orcamento_Opcional && orcamento.Orcamento_Opcional.length > 0
    ? `Opcionais: *${orcamento.Orcamento_Opcional.map(opcional => 
        `${opcional.Opcional.nomeOpcional}*, `
    ).join('\n')}`
    : '';

    const detalhesBar = orcamento.CardapioBar && orcamento.CardapioBar.nomeCardapioBar
    ? `Bar: *${orcamento.CardapioBar.nomeCardapioBar}*`
    : '';

    return `*${orcamento.Lead.nomeLead}*
Me chamo ${localStorage.getItem('username')} e sejam bem-vindos à Badulaque Eventos✨!

Conforme solicitado, segue prévia do orçamento abaixo referente ao evento *${orcamento.tipoEvento}*, para *${formatarDataExtenso(orcamento.dataEvento)}* considerando *${orcamento.numConvidados}* convidados. 👇🏻

Detalhes do Orçamento Solicitado
Cardápio: *${orcamento.Cardapio.nomeCardapio}*
Cerveja: *${orcamento.Cerveja.nome}*
${detalhesBar}
${detalhesOpcionais}
Link para Orçamento completo: ${linkOrcamento}

Caso deseje visualizar os detalhes de cada cardápio, envie "cardápio" no chat que todos os cardápios são enviados!
                        
Gostaríamos de convidá-los para conhecer nossa infraestrutura para que possamos entregar a primeira experiência de como é realizar este sonho em nosso espaço. 
Além de conversamos melhor sobre suas expectativas para oferecermos um evento personalizado e único, tornando esse dia ainda mais especial e inesquecível.

Veja os sonhos realizados na Badulaque através do nosso Instagram
https://www.instagram.com/badulaque_eventos/

Qual o melhor dia e horário para realizarmos uma visita? 😊`;
}