<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <div class="content">
                <div class="form-row">
                    <div class="form-column">
                        <h4>Cliente</h4><br>
                        <label>Nome:</label>
                        <input type="text" disabled v-model="nome">
                        <label>Contato</label>
                        <input type="text" disabled v-model="telefone">
                        <label>Cidade</label>
                        <input type="text" disabled v-model="cidade">
                        <h4>Contratante(s)</h4>
                        <div v-for="(contratante, index) in contratantes" :key="index" class="contratante-item">
                            <label>Nome:</label>
                            <input type="text" disabled :value="contratante.nome">
                            <div class="form-group">
                                <div class="form-item">
                                    <label>RG:</label>
                                    <input type="text" disabled :value="contratante.rg">
                                </div>
                                <div class="form-item">
                                    <label>CPF:</label>
                                    <input type="text" disabled :value="contratante.cpf">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-item">
                                    <label>Cidade:</label>
                                    <input type="text" disabled :value="contratante.cidade">
                                </div>
                                <div class="form-item">
                                    <label>Rua:</label>
                                    <input type="text" disabled :value="contratante.rua">
                                </div>
                            </div>
                            <div class="form-item">
                                <label>CEP:</label>
                                <input type="text" disabled :value="contratante.cep">
                            </div>
                        </div>
                    </div>
                    <div class="form-column">
                        <h4>Evento</h4><br>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Referência</label>
                                <input type="text" v-model="referencia" disabled>
                            </div>
                            <div class="form-item">
                                <label>Tipo Evento</label>
                                <input type="text" v-model="tipoEvento" disabled>
                            </div>
                        </div>
                        <label>Data</label>
                        <input type="text" v-model="data" disabled>
                        <label>Valor Espaço</label>
                        <input type="text" v-model="valorEspaco" disabled>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Convidados</label>
                                <input type="text" v-model="convidados" disabled>
                            </div>
                            <div class="form-item">
                                <label>Total Contrato:</label>
                                <input class="valorTotal" type="text" v-model="totalProposta" disabled>
                            </div>
                        </div>
                        <h4>Buffet</h4>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Cardapio:</label>
                                <input type="text" v-model="cardapioBuffet" disabled>
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input type="text" v-model="valorCardapio" disabled>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Cerveja:</label>
                                <input type="text" v-model="tipoBebida" disabled>
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input type="text" v-model="valorCerveja" disabled>
                            </div>
                        </div>
                        <label>Total Buffet</label>
                        <input class="valorTotal" type="text" v-model="valorTotalBuffet" disabled>
                        <h4>Bar</h4>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Cardapio</label>
                                <input type="text" v-model="cardapioBar" disabled>
                            </div>
                            <div class="form-item">
                                <label>Valor</label>
                                <input type="text" v-model="valorPorPessoaBar" disabled>
                            </div>
                        </div>
                        <label>Total Bar</label>
                        <input class="valorTotal" type="text" v-model="valorTotalBar" disabled>


                    </div>
                    <div class="form-column">
                        <h4>Opcionais</h4><br>
                        <h4>Pagamento</h4><br>
                        <label>Tipo</label>
                        <input type="text" v-model="formaPagamento.tipo" disabled>
                        <label>Sinal</label>
                        <input type="text" v-model="valorSinal" disabled v-if="formaPagamento.valorSinal !== 0">
                        <label v-if="formaPagamento.numeroParcelas !== 0">Número Parcelas</label>
                        <input type="text" v-model="numeroParcelas" disabled v-if="formaPagamento.numeroParcelas !== 0">
                        <label>Numero Parcelas</label>
                        <input type="text" v-model="numeroParcelasEntrada" disabled
                            v-if="formaPagamento.numeroParcelasEntrada !== 0">
                        <label>Valor Parcelas</label>
                        <input type="text" v-model="valorParcela" disabled v-if="formaPagamento.valorParcela !== 0">
                        <label>Saldo</label>
                        <input type="text" v-model="saldo" disabled v-if="formaPagamento.valorParcela !== 0">




                    </div>
                </div>
            </div>

            <div class="form-group">
                <button class="submit-button">Visualizar PDF</button>
            </div>

        </form>
    </div>


</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatarValorMonetario } from '@/common/utils/Helper';
import instance from '@/common/utils/AuthService';
import { Cliente, Contrato } from '@/common/utils/Interfaces/Contrato/ContratoDetalhes';
import { formatarDataExtenso } from '@/common/utils/Helper/Data';
import { FormaPagamento, OrcamentoOpcional } from '@/common/utils/Interfaces/Orcamento';
import { Opcional } from '@/common/utils/Interfaces';


export default defineComponent({
    props: {
        contratoId: {
            type: Number,
            required: false,
            default: null,
        },
    },
    data() {
        return {
            //Cliente
            id: '',
            nome: '',
            email: '',
            cidade: '',
            telefone: '',
            contratantes: [] as Cliente[],
            //Data
            data: '',
            dataEventoRaw: '',

            //Orçamento
            convidados: '',
            referencia: '',
            cerimonia: '',
            totalProposta: '',
            dataCriação: '',
            tipoEvento: '',
            dataEnvio: '',
            observacoes: '',

            //Espaço
            diaSemana: '',
            valorEspaco: '',

            //Cardapio
            cardapioBuffet: '',
            cardapioBuffetId: 0,
            valorCardapio: '',

            //Cerveja
            tipoBebida: '',
            tipoBebidaId: 0,


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

            formaPagamento: {} as FormaPagamento,
            tipoPagamento: '',
            valorSinal: '',
            numeroParcelas: '',
            numeroParcelasEntrada: '',
            valorParcela: '',
            valorTotal: '',
            saldo: ''
        };
    },

    methods: {
        close() {
            this.$emit('close');
        },
        formatarValorMonetario,

        async fetchContratoDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<Contrato>('/contrato/info/' + id);
                const contrato = response.data;

                this.nome = contrato.Orcamento.Lead.nomeLead
                this.telefone = contrato.Orcamento.Lead.celular
                this.cidade = contrato.Orcamento.Lead.cidade
                this.contratantes = contrato.Cliente

                this.referencia = contrato.Orcamento.referenciaOrcamento
                this.data = formatarDataExtenso(contrato.Orcamento.dataEvento)
                this.tipoEvento = contrato.Orcamento.tipoEvento
                this.valorEspaco = formatarValorMonetario(contrato.Orcamento.valorEspacoFinal)

                this.convidados = contrato.Orcamento.numConvidados.toString()
                this.totalProposta = formatarValorMonetario(contrato.Orcamento.valorTotalOrcamento)

                this.cardapioBuffet = contrato.Orcamento.Cardapio.nomeCardapio
                this.valorCardapio = formatarValorMonetario(contrato.Orcamento.valorPPCardapio)
                this.tipoBebida = contrato.Orcamento.Cerveja.nome
                this.valorCerveja = formatarValorMonetario(contrato.Orcamento.valorPPCerveja)
                this.valorTotalBuffet = formatarValorMonetario((contrato.Orcamento.valorPPCardapio + contrato.Orcamento.valorPPCerveja) * contrato.Orcamento.numConvidados)

                this.cardapioBar = contrato.Orcamento.CardapioBar.nomeCardapioBar
                this.valorPorPessoaBar = formatarValorMonetario(contrato.Orcamento.valorPPBar)
                this.valorTotalBar = formatarValorMonetario(contrato.Orcamento.valorPPBar * contrato.Orcamento.numConvidados)

                const formaPagamento = await instance.get<FormaPagamento>(`/contrato/formaPagamento/${contrato.FormaPagamento_idFormaPagamento}`);
                this.formaPagamento = formaPagamento.data;
                this.valorSinal = formatarValorMonetario(this.formaPagamento.valorSinal)
                this.numeroParcelas = this.formaPagamento.numeroParcelas.toString(),
                    this.numeroParcelasEntrada = this.formaPagamento.numeroParcelasEntrada.toString(),
                    this.valorParcela = formatarValorMonetario(this.formaPagamento.valorParcela),
                    this.saldo = formatarValorMonetario(this.formaPagamento.valorTotal - this.formaPagamento.valorEntrada)

            } catch (error) {
                console.error('Erro ao buscar detalhes do contrato:', error);
            } finally {
                this.loading = false;
            }
        },
    },

    watch: {
        contratoId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchContratoDetails(newId);
                }
            },
        },
    },


});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>