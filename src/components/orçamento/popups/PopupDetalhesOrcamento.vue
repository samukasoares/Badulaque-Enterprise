<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <div class="content">
                <div class="form-row">
                    <div class="form-column">
                        <h4>Geral</h4><br>
                        <div class="form-group">
                            <div class="form-item">
                                <label>ID:</label>
                                <input v-model="id" disabled type="text">
                            </div>
                            <div class="form-item">
                                <label>Referência:</label>
                                <input v-model="referencia" disabled type="text">
                            </div>
                        </div>
                        <label>Nome:</label>
                        <input v-model="nome" disabled type="text">
                        <label>Email:</label>
                        <input v-model="email" disabled type="text">
                        <label>Telefone:</label>
                        <input v-model="telefone" disabled type="text">
                        <label>Cidade:</label>
                        <input v-model="cidade" disabled type="text">
                        <label>Tipo de Evento:</label>
                        <input v-model="tipoEvento" disabled type="text">
                        <label>Data:</label>
                        <input v-model="data" :disabled="!isEditing" type="text">
                        <label>Convidados:</label>
                        <input v-model="convidados" disabled type="text">
                        <label>Total Proposta:</label>
                        <input class="valorTotal" v-model="totalProposta" disabled type="text">


                    </div>

                    <div class="form-column">
                        <h4>Espaço</h4><br>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Valor:</label>
                                <input class="valorTotal" v-model="valorEspaco" disabled type="text">
                            </div>
                            <div class="form-item">
                                <label>Cerimônia no Local:</label>
                                <input v-model="cerimonia" disabled type="text">
                            </div>
                        </div>
                        <h4>Buffet</h4><br>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Cardápio:</label>
                                <input v-model="cardapioBuffet" disabled type="text">
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorCardapio" disabled type="text">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="form-item">
                                <label>Cerveja:</label>
                                <input v-model="tipoBebida" disabled type="text">
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorCerveja" disabled type="text">
                            </div>
                        </div>

                        <label>Valor por Pessoa Total:</label>
                        <input v-model="valorPorPessoaBuffet" disabled type="text">
                        <label>Valor Total:</label>
                        <input class="valorTotal" v-model="valorTotalBuffet" disabled type="text">
                        <h4>BAR</h4><br>
                        <label>Cardápio:</label>
                        <input v-model="cardapioBar" disabled type="text">
                        <label>Valor por pessoa:</label>
                        <input v-model="valorPorPessoaBar" disabled type="text">
                        <label>Valor Total:</label>
                        <input class="valorTotal" v-model="valorTotalBar" disabled type="text">
                    </div>

                    <div class="form-column">
                        <h4>Controle</h4><br>
                        <label>Data Criação:</label>
                        <input v-model="dataCriação" disabled type="text">
                        <label>Data Envio:</label>
                        <input v-model="dataEnvio" disabled type="text">
                        <h4>Opcionais</h4>

                        <div v-if="opcionaisSelecionados.length">
                            <div v-for="(opcional, idOpcional) in opcionaisSelecionados" :key="idOpcional">
                                <label>{{ opcional.Opcional.nomeOpcional }}:</label>
                                <input :value="formatarValorMonetario(opcional.valorOrcamento)" disabled type="text">
                            </div>
                        </div>

                        <h4>Observações</h4>
                        <input v-model="observacoes" disabled type="text" class="textarea">


                    </div>

                    <div class="form-column">
                        <h4>Forma de Pagamento 1</h4><br>
                        <label>Sinal:</label>
                        <input v-model="sinalParcelado" disabled>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Parcelas:</label>
                                <input v-model="parcelasParcelado" disabled>
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorParcelas" disabled>
                            </div>
                        </div>


                        <h4>Forma de Pagamento 2</h4><br>
                        <label>Sinal:</label>
                        <input v-model="sinalEntrada" disabled>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Qtd. Parcelas Entrada:</label>
                                <input v-model="parcelasEntrada" disabled>
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorEntrada" disabled>
                            </div>
                        </div>
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

            <div class="form-group">
                <button class="submit-button" @click="gerarPDF">Visualizar PDF</button>
                <button class="submit-button">Visualizar Detalhado</button>
                <button class="submit-button" @click="toggleEditMode">Editar</button>
                <button class="submit-button">Salvar</button>
            </div>

        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cardapio } from '@/common/utils/Interfaces';
import instance from '@/common/utils/AuthService';
import { Orcamento, OrcamentoOpcional } from '@/common/utils/Interfaces/Orcamento';
import { formatarCelular, formatarDataExtenso, formatarDateToString, formatarValorMonetario } from '@/common/utils/Helper';
import { gerarPDFDoHtml } from '@/common/utils/pdfService';


export default defineComponent({
    props: {
        orcamentoId: {
            type: Number,
            required: false,
            default: null,
        },
    },
    data() {
        return {
            id: '',
            referencia: '',
            nome: '',
            email: '',
            tipoEvento: '',
            cidade: '',
            data: '',
            convidados: '',
            cerimonia: '',
            totalProposta: '',
            dataCriação: '',
            telefone: '',
            dataEnvio: '',
            observacoes: '',
            diaSemana: '',
            valorEspaco: '',
            cardapioBuffet: '',
            valorCardapio: '',
            tipoBebida: '',
            valorCerveja: '',
            valorPorPessoaBuffet: '',
            valorTotalBuffet: '',
            cardapioBar: '',
            valorPorPessoaBar: '',
            valorTotalBar: '',
            valorNoiva: '',
            valorCabine: '',
            valorOpcionais: '',
            loading: false,
            isEditing: false,


            opcionaisSelecionados: [] as OrcamentoOpcional[],
            sinal1: '',

            sinalEntrada: '',
            parcelasEntrada: '',
            valorEntrada: '',
            valorParcelasEntrada: '',
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
        formatarValorMonetario,
        toggleEditMode() {
            if (this.isEditing) {
                // Se estiver no modo de edição e o usuário clicar em "Salvar", salve as alterações
                this.saveChanges();
            }
            this.isEditing = !this.isEditing;
        },
        async saveChanges() {
            console.log("salvo!")
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
                this.data = formatarDataExtenso(orcamento.dataEvento);
                this.tipoEvento = orcamento.tipoEvento;
                this.cidade = orcamento.Lead.cidade;
                this.telefone = formatarCelular(orcamento.Lead.celular);
                this.convidados = orcamento.numConvidados.toString();
                this.valorEspaco = formatarValorMonetario(orcamento.valorEspacoFinal);
                this.cardapioBuffet = orcamento.Cardapio.nomeCardapio;
                this.valorCardapio = formatarValorMonetario(orcamento.valorPPCardapio);
                this.tipoBebida = orcamento.Cerveja.nome;
                this.valorCerveja = formatarValorMonetario(orcamento.Cerveja.valor);
                this.valorPorPessoaBuffet = formatarValorMonetario(orcamento.valorPPCardapio + orcamento.valorPPCerveja)
                this.valorTotalBuffet = formatarValorMonetario((orcamento.valorPPCardapio + orcamento.valorPPCerveja) * orcamento.numConvidados)
                this.cardapioBar = orcamento.CardapioBar.nomeCardapioBar;
                this.valorPorPessoaBar = formatarValorMonetario(orcamento.valorPPBar);
                this.valorTotalBar = formatarValorMonetario(orcamento.valorPPBar * orcamento.numConvidados);
                this.totalProposta = formatarValorMonetario(orcamento.FormaPagamento[2].valorTotal);
                this.observacoes = orcamento.observacoesOrcamento;
                this.dataCriação = formatarDateToString(orcamento.createdAt);
                this.dataEnvio = orcamento.enviadoEm ? formatarDateToString(orcamento.enviadoEm) : '-';
                this.cerimonia = orcamento.cerimoniaLocal === 1 ? 'Sim' : 'Não';

                this.opcionaisSelecionados = orcamento.Orcamento_Opcional;

                //Forma Pagamento à vista
                this.sinalAVista = formatarValorMonetario(orcamento.FormaPagamento[0].valorSinal);
                this.valorAVista = formatarValorMonetario(orcamento.FormaPagamento[0].valorTotal);

                //Forma Pagamento Entrada
                this.sinalEntrada = formatarValorMonetario(orcamento.FormaPagamento[1].valorSinal);
                this.parcelasEntrada = (orcamento.FormaPagamento[1].numeroParcelasEntrada).toString();
                this.valorEntrada = formatarValorMonetario(orcamento.FormaPagamento[1].valorParcela);
                this.saldoEntrada = formatarValorMonetario(orcamento.FormaPagamento[1].valorTotal - orcamento.FormaPagamento[1].valorEntrada);
                this.valorParcelasEntrada = formatarValorMonetario(orcamento.FormaPagamento[1].valorParcela / orcamento.FormaPagamento[1].numeroParcelasEntrada);

                //Forma Pagamento Parcelado
                this.sinalParcelado = formatarValorMonetario(orcamento.FormaPagamento[2].valorSinal);
                this.parcelasParcelado = (orcamento.FormaPagamento[2].numeroParcelas).toString();
                this.valorParcelas = formatarValorMonetario(orcamento.FormaPagamento[2].valorParcela);

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

            const opcionaisSelecionadosHTML = this.opcionaisSelecionados.map(opcional => {
                return `<span class="flex-item-estrutura"><strong>${opcional.Opcional.nomeOpcional}:</strong><span>R$ ${opcional.valorOrcamento}</span></span>`;
            }).join('');

            return template
                .replace('{{id}}', this.id)
                .replace('{{referencia}}', this.referencia)
                .replace('{{nome}}', this.nome)
                .replace('{{cidade}}', this.cidade)
                .replace('{{telefone}}', this.telefone)
                .replace('{{tipoEvento}}', this.tipoEvento)
                .replace('{{data}}', this.data)
                .replace('{{convidados}}', this.convidados)
                .replace('{{totalProposta}}', this.totalProposta)
                .replace('{{dataCriacao}}', this.dataCriação)
                .replace('{{dataEnvio}}', this.dataEnvio)
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
                .replace('{{cardapios}}', cardapiosHTML)
                .replace('{{opcionais}}', opcionaisSelecionadosHTML)
                .replace('{{cerimonia}}', this.cerimonia)
                .replace('{{dataCriacao}}', this.dataCriação)

                .replace('{{sinalAVista}}', this.sinalAVista)
                .replace('{{valorAVista}}', this.valorAVista)

                .replace('{{sinalEntrada}}', this.sinalEntrada)
                .replace('{{parcelasEntrada}}', this.parcelasEntrada)
                .replace('{{valorEntrada}}', this.valorEntrada)
                .replace('{{saldoEntrada}}', this.saldoEntrada)
                .replace('{{valorParcelasEntrada}}', this.valorParcelasEntrada)

                .replace('{{sinalParcelado}}', this.sinalParcelado)
                .replace('{{parcelasParcelado}}', this.parcelasParcelado)
                .replace('{{valorParcelas}}', this.valorParcelas)
        },
        async gerarPDF() {
            try {
                const templatePath = '/template-orcamento.html';
                const response = await fetch(templatePath);
                let template = await response.text();

                template = this.preencherTemplate(template);
                await gerarPDFDoHtml(template, this.referencia);
            } catch (error) {
                console.error('Erro ao gerar o PDF:', error);
            }
        }

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