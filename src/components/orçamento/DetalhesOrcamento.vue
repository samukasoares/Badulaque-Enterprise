<template>
    <div id="content-to-export">
        <div class="header">
            <div class="logo">
                <img :src="require('@/assets/logos/MenuFull.png')" alt="Menu Full" width="150px">
            </div>
            <p>Orçamento <span style="color: var(--verde-escuro); font-weight:bold">2501</span></p>
            <p>Evento: <span style="color: var(--verde-escuro); font-weight:bold">Casamento</span></p>
            <p>______________________________________________________________________________________________________________________________________________</p>
            <p><span style="color: var(--verde-escuro); font-weight:bold">A proposta tem validade de 15 dias</span></p>
        </div>
        <div class="dados-evento">
            <h3 class="background">DADOS DO EVENTO</h3>
            <p class="primeira-linha"><span style="color: var(--verde-escuro); font-weight:bold">Nome:</span> Ana Flavia & Fábio</p>
            <p class="primeira-linha"><span style="color: var(--verde-escuro); font-weight:bold">Telefone:</span> 5519995595179</p>
            <p class="primeira-linha"><span style="color: var(--verde-escuro); font-weight:bold">Cidade:</span> Campinas - SP</p>
            <p class="segunda-linha"><span style="color: var(--verde-escuro); font-weight:bold">Convidados:</span> 150</p>
            <p class="segunda-linha"><span style="color: var(--verde-escuro); font-weight:bold">Data:</span> sábado, 1 de novembro de 2025</p>
            <p class="segunda-linha"><span style="color: var(--verde-escuro); font-weight:bold">Cerimônia:</span></p>
        </div>
        <div class="inclusos-orcamento">
            <h3 class="background">ESTRUTURA E SERVIÇOS INCLUSOS NO ORÇAMENTO</h3>
            <ul>
            <li>Salão com capacidade para 250 pessoas podendo variar conforme o projeto de montagem</li>
            <li>Espaço para cerimônia ao ar livre em frente ao lago e deck coberto</li>
            <li>Bancos para cerimônia</li>
            <li>Mesas redondas e Cadeiras brancas</li>
            <li>Estacionamento para 100 veículos</li>
            <li>Gerador de 50Kva sem limite de utilização</li>
            <li>Ar-condicionado no salão principal</li>
            <li>Espaço Kids com monitor</li>
            <li>Banheiros masculinos, femininos e para deficientes físicos</li>
            <li>Fraldário e sala de amamentação</li>
            <li>Iluminação decorativa interna e externa</li>
            </ul>
        </div>
        <div class="servico-buffet">
            <h3 class="background">SERVIÇO DE BUFFET</h3>
            <ul>
            <li>5 horas de serviço com possibilidade de horas extras com serviço de bebidas</li>
            <li>Personalização dos cardápios</li>
            <li>Souplast de Inox ou Ratan</li>
            <li>Louças de porcelana</li>
            <li>Taças de vidro</li>
            <li>Atendimento com 1 garçom para servir até 20 convidados</li>
            <li>Crianças de 0 a 5 anos livres, de 6 a 10 anos pagam 50% e 10+ anos pagam 100%</li>
            </ul>
            <p>Cardápio solicitado: <span style="color: var(--verde-escuro); font-weight:bold">Cardapio prata</span></p>
            <p>Cerveja: <span style="color: var(--verde-escuro); font-weight:bold">Brahma/skol</span></p>
            <p>Valor por pessoa: <span style="color: var(--verde-escuro); font-weight:bold">R$ 147,00</span></p>
        </div>
        <div class="outros-cardapios">
            <h3 class="background">OUTROS CARDÁPIOS (valor por pessoa) OPCIONAIS</h3>
            <p>Bronze: R$ 119,00</p>
            <p>Cabine de fotos/Plataforma 360: R$ 0,00</p>
            <p>Prata: R$ 147,00</p>
            <p>Ouro: R$ 168,00</p>
            <p>Coquetel: R$ 157,00</p>
            <p>Churrasco Fatiado: R$157,00</p>
            <p>Mineira: R$125,00</p>
            <p>Boteco: R$147,00</p>
            <h3>OPCIONAIS</h3>
                <p>Cabine de fotos/Plataforma 360: R$0,00</p>
                <p>Pacote Bartender .................... P r a t a R$4.500</p>
                <p>Espaço da noiva: R$0,00</p>
        </div>
        <div class="valores">
            <h3 class="background">VALORES</h3>
                <p>Espaço: R$0,00</p>
                <p>Buffet: R$0,00</p>
                <p>Opcionais: R$0,00</p>
                <p>Total da proposta: R$0,00</p>
        </div>
        <div class="forma-pagamento">
            <h3 class="background">FORMA DE PAGAMENTO</h3>
            <ul>
                <li>Sinal de R$2.000,00 para reserva de data         **Em caso de desistência o sinal não será devolvido</li>
                <li>Parcelado mensalmente em 16 parcelas de R$2.096,88  OU</li>
                <ul><li><p>Entrada de R$10.065,00 em 3 vezes de R$3.355, saldo 15 dias antes do evento  OU</p></li></ul>
                <ul><li><p>À vista: R$33.401,16</p></li></ul> <ul><li>Desconto 6,04%</li></ul>
                
            </ul>
        </div>
    </div>
    <button @click="exportPDF">Export to PDF</button>    
</template>

<script>
import html2pdf from 'html2pdf.js';

export default {
  methods: {
    exportPDF() {
      const element = document.getElementById('content-to-export');
      html2pdf(element, {
        margin: 1,
        filename: 'my-content.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      });
    }
  }
};
</script>

<style>
:root {
    --verde-claro: #425C4D;
    --verde-escuro: #2F4036;
    --fonte-primaria: 14px;
}
.background {
    color: white;
    background: var(--verde-escuro);
}
.dados-evento, .inclusos-orcamento, .servico-buffet, .outros-cardapios, .valores, .forma-pagamento {
    color:var(--verde-claro);
    font-size: var(--fonte-primaria);
    font-family: 'Times New Roman', Times, serif;
}
</style>