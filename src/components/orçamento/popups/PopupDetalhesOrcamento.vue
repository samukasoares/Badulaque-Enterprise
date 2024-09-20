<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <div class="content">
                <div class="form-row">
                    <div class="form-column">
                        <h4>Geral</h4><br>
                        <label>ID:</label>
                        <input v-model="id" disabled type="text">
                        <label>Referência:</label>
                        <input v-model="referencia" disabled type="text">
                        <label>Nome:</label>
                        <input v-model="nome" disabled type="text">
                        <label>Email:</label>
                        <input v-model="email" disabled type="text">
                        <label>Telefone:</label>
                        <input v-model="telefone" disabled type="text">
                        <label>Tipo de Evento:</label>
                        <input v-model="tipoEvento" disabled type="text">
                        <label>Data:</label>
                        <input v-model="data" disabled type="text">
                        <label>Convidados:</label>
                        <input v-model="convidados" disabled type="text">
                        <label>Total Proposta:</label>
                        <input v-model="totalProposta" disabled type="text">
                        <h4>Controle</h4><br>
                        <label>Data Envio:</label>
                        <input v-model="dataEnvio" disabled type="text">
                        <label>Hora Envio:</label>
                        <input v-model="horaEnvio" disabled type="text">

                    </div>

                    <div class="form-column">
                        <h4>Espaço</h4><br>
                        <label>Dia da Semana:</label>
                        <input v-model="diaSemana" disabled type="text">
                        <label>Valor:</label>
                        <input v-model="valorEspaco" disabled type="text">
                        <h4>Buffet</h4><br>
                        <label>Cardápio:</label>
                        <input v-model="cardapioBuffet" disabled type="text">
                        <label>Tipo de Bebida:</label>
                        <input v-model="tipoBebida" disabled type="text">
                        <label>Valor por pessoa:</label>
                        <input v-model="valorPorPessoaBuffet" disabled type="text">
                        <label>Valor Total:</label>
                        <input v-model="valorTotalBuffet" disabled type="text">
                        <h4>BAR</h4><br>
                        <label>Cardápio:</label>
                        <input v-model="cardapioBar" disabled type="text">
                        <label>Valor por pessoa:</label>
                        <input v-model="valorPorPessoaBar" disabled type="text">
                        <label>Valor Total:</label>
                        <input v-model="valorTotalBar" disabled type="text">
                    </div>

                    <div class="form-column">
                        <h4>Opcionais</h4>
                        <div v-if="opcionaisSelecionados.length">
                            <div v-for="(opcional, idOpcional) in opcionaisSelecionados" :key="idOpcional">
                                <label>{{ opcional.Opcional.nomeOpcional }}:</label>
                                <input :value="opcional.Opcional.valorAtual" disabled type="text">
                            </div>
                        </div>
                    </div>

                    <div class="form-column">
                        <h4>Forma de Pagamento 1</h4><br>
                        <label>Sinal:</label>
                        <input v-model="sinalParcelado" disabled>
                        <label>Parcelas:</label>
                        <input v-model="parcelasParcelado" disabled>
                        <label>Valor:</label>
                        <input v-model="valorParcelas" disabled>

                        <h4>Forma de Pagamento 2</h4><br>
                        <label>Sinal:</label>
                        <input v-model="sinalEntrada" disabled>
                        <label>Qtd. Parcelas Entrada:</label>
                        <input v-model="parcelasEntrada" disabled>
                        <label>Valor:</label>
                        <input v-model="valorEntrada" disabled>
                        <label>Saldo:</label>
                        <input v-model="saldoEntrada" disabled>

                        <h4>Forma de Pagamento 3</h4><br>
                        <label>Sinal:</label>
                        <input v-model="sinalAVista" disabled>
                        <label>Valor:</label>
                        <input v-model="valorAVista" disabled>
                    </div>
                </div>
            </div>
            <h4>Observações</h4>
            <input v-model="observacoes" disabled type="text" class="textarea">

            <div class="form-group">
                <button class="submit-button" @click="gerarPDF">Visualizar Orcamento</button>
                <button class="submit-button">Visualizar Detalhado</button>
            </div>

        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Cardapio, RegistroOrcamento } from '@/common/utils/Interfaces';
import instance from '@/common/utils/AuthService';
import { Orcamento, OrcamentoOpcional } from '@/common/utils/Interfaces/Orcamento';
import { formatarCelular, formatarData } from '@/common/utils/Helper';

export default defineComponent({
    props: {
        orcamentoId: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            id: '',
            referencia: '',
            nome: '',
            email: '',
            tipoEvento: '',
            data: '',
            convidados: '',
            totalProposta: '',
            dataEnvio: '',
            telefone: '',
            horaEnvio: '',
            observacoes: '',
            diaSemana: '',
            valorEspaco: '',
            cardapioBuffet: '',
            tipoBebida: '',
            valorPorPessoaBuffet: '',
            valorTotalBuffet: '',
            cardapioBar: '',
            valorPorPessoaBar: '',
            valorTotalBar: '',
            valorNoiva: '',
            valorCabine: '',
            loading: false,

            opcionaisSelecionados: [] as OrcamentoOpcional[],
            sinal1: '',

            sinalEntrada: '',
            parcelasEntrada: '',
            valorEntrada: '',
            saldoEntrada: '',

            sinalAVista: '',
            valorAVista: '',

            sinalParcelado: '',
            parcelasParcelado: '',
            valorParcelas: '',

            cardapios: [] as Cardapio[],
        };
    },

    methods: {
        close() {
            this.$emit('close');
        },
        async fetchOrcamentoDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<Orcamento>('/orcamento/get/' + id);
                const orcamento = response.data;

                this.id = orcamento.idOrcamento.toString();
                this.nome = orcamento.Lead.nomeLead;
                this.email = orcamento.Lead.email;
                this.referencia = orcamento.referenciaOrcamento;
                this.data = formatarData(orcamento.dataEvento);
                this.tipoEvento = orcamento.tipoEvento;
                this.telefone = formatarCelular(orcamento.Lead.celular);
                this.convidados = orcamento.numConvidados.toString();
                this.valorEspaco = orcamento.valorEspacoFinal.toString();
                this.cardapioBuffet = orcamento.Cardapio.nomeCardapio;
                this.tipoBebida = orcamento.Cerveja.nome;
                this.valorPorPessoaBuffet = orcamento.valorPPCardapio.toString();
                this.valorTotalBuffet = (orcamento.valorPPCardapio * orcamento.numConvidados).toString();
                this.cardapioBar = orcamento.CardapioBar.nomeCardapioBar;
                this.valorPorPessoaBar = orcamento.valorPPBar.toString();
                this.valorTotalBar = (orcamento.valorPPBar * orcamento.numConvidados).toString();
                this.totalProposta = orcamento.FormaPagamento[2].valorTotal.toString();
                this.opcionaisSelecionados = orcamento.Orcamento_Opcional
                console.log(this.opcionaisSelecionados)
                //Forma Pagamento à vista
                this.sinalAVista = orcamento.FormaPagamento[0].valorSinal.toString();
                this.valorAVista = orcamento.FormaPagamento[0].valorTotal.toString();

                //Forma Pagamento Entrada
                this.sinalEntrada = orcamento.FormaPagamento[1].valorSinal.toString();
                this.parcelasEntrada = orcamento.FormaPagamento[1].numeroParcelasEntrada.toString();
                this.valorEntrada = orcamento.FormaPagamento[1].valorParcela.toString();
                this.saldoEntrada = (orcamento.FormaPagamento[1].valorTotal - orcamento.FormaPagamento[1].valorEntrada).toString();

                //Forma Pagamento Parcelado
                this.sinalParcelado = orcamento.FormaPagamento[2].valorSinal.toString();
                this.parcelasParcelado = orcamento.FormaPagamento[2].numeroParcelas.toString();
                this.valorParcelas = orcamento.FormaPagamento[2].valorParcela.toString();

            } catch (error) {
                console.error('Erro ao buscar detalhes do orçamento:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchCardapios() {
            try {
                let response = await instance.get<Cardapio[]>('/buffet/cardapios');
                this.cardapios = response.data
            } catch (error) {
                console.error('Erro ao buscar cardápios:', error);
            }
        },
        preencherTemplate(template: string) {
            const cardapiosHTML = this.cardapios.map(cardapio => {
                return `<span class="flex-item-estrutura"><strong>${cardapio.nomeCardapio}:</strong><span>R$ ${cardapio.precoCardapio}</span></span>`;
            }).join('');

            return template
                .replace('{{id}}', this.id)
                .replace('{{referencia}}', this.referencia)
                .replace('{{nome}}', this.nome)
                .replace('{{tipoEvento}}', this.tipoEvento)
                .replace('{{data}}', this.data)
                .replace('{{convidados}}', this.convidados)
                .replace('{{totalProposta}}', this.totalProposta)
                .replace('{{dataEnvio}}', this.dataEnvio)
                .replace('{{horaEnvio}}', this.horaEnvio)
                .replace('{{observacoes}}', this.observacoes)
                .replace('{{diaSemana}}', this.diaSemana)
                .replace('{{valorEspaco}}', this.valorEspaco)
                .replace('{{cardapioBuffet}}', this.cardapioBuffet)
                .replace('{{tipoBebida}}', this.tipoBebida)
                .replace('{{valorPorPessoaBuffet}}', this.valorPorPessoaBuffet)
                .replace('{{valorTotalBuffet}}', this.valorTotalBuffet)
                .replace('{{cardapioBar}}', this.cardapioBar)
                .replace('{{valorPorPessoaBar}}', this.valorPorPessoaBar)
                .replace('{{valorTotalBar}}', this.valorTotalBar)
                .replace('{{valorNoiva}}', this.valorNoiva)
                .replace('{{valorCabine}}', this.valorCabine)
                .replace('{{cardapios}}', cardapiosHTML);
        },
        async gerarPDF() {
            try {
                const templatePath = '/template-orcamento.html';
                const response = await fetch(templatePath);
                let template = await response.text();

                template = this.preencherTemplate(template);

                const doc = new jsPDF('p', 'mm', 'a4');
                doc.setProperties({
                    title: this.referencia
                });

                // Cria um iframe invisível
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.left = '-9999px';
                document.body.appendChild(iframe);

                // Verifica se o contentWindow não é null
                if (!iframe.contentWindow) {
                    console.error('Erro: iframe.contentWindow é nulo');
                    return;
                }

                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (!iframeDoc) {
                    console.error('Erro: Não foi possível acessar o documento do iframe');
                    return;
                }
                iframeDoc.open();
                iframeDoc.write(template);
                iframeDoc.close();

                iframe.onload = async () => {
                    try {
                        const canvas = await html2canvas(iframeDoc.body, { scale: 4 });
                        const imgData = canvas.toDataURL('image/png');
                        const imgWidth = 210; // Largura da página A4 em mm
                        const pageHeight = 295; // Altura da página A4 em mm
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        let heightLeft = imgHeight;

                        let position = 0;

                        while (heightLeft >= 0) {
                            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                            if (heightLeft >= 0) {
                                position = heightLeft - imgHeight;
                                doc.addPage();
                            }
                        }

                        const pdfBlob = doc.output('blob');
                        const pdfUrl = URL.createObjectURL(pdfBlob);
                        window.open(pdfUrl);

                        // Remove o iframe após a geração do PDF
                        document.body.removeChild(iframe);
                    } catch (error) {
                        console.error('Erro ao gerar o canvas:', error);
                    }
                };
            } catch (error) {
                console.error('Erro ao carregar o template:', error);
            }
        },
    },

    mounted() {
        this.fetchCardapios();
    },

    watch: {
        orcamentoId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchOrcamentoDetails(newId);
                }
            },
        },
    },
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>