<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <div class="content">
                <div class="form-row">
                    <div class="form-column">
                        <h4>Cliente</h4><br>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Id Orçamento</label>
                                <input type="text" disabled v-model="idOrcamento">
                            </div>
                            <div class="form-item">
                                <label>Id Contrato</label>
                                <input type="text" disabled v-model="idContrato">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Nome</label>
                                <input type="text" disabled v-model="nome">
                            </div>
                            <div class="form-item">
                                <label>Contato</label>
                                <input type="text" disabled v-model="telefone">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="form-item">
                                <label>Cidade</label>
                                <input type="text" disabled v-model="cidade">
                            </div>
                            <div class="form-item">
                                <label>Patrocinado</label>
                                <input type="text" disabled v-model="patrocinado">
                            </div>
                        </div>

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
                                    <label>CEP:</label>
                                    <input type="text" disabled :value="contratante.cep">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-item">
                                    <label>Rua:</label>
                                    <input type="text" disabled :value="contratante.rua">
                                </div>
                                <div class="form-item">
                                    <label>Número:</label>
                                    <input type="text" disabled :value="contratante.numero">
                                </div>
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
                        <input type="text" v-model="valorEspaco" disabled class="valorTotal">
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
                        <div v-if="opcionaisSelecionados.length > 0">
                            <h4>Opcionais</h4><br>
                            <div v-for="(opcional, index) in opcionaisSelecionados" :key="index" class="opcional-item">
                                <label>{{ opcional.Opcional.nomeOpcional }}</label>
                                <input type="text" :value="formatarValorMonetario(opcional.valorOrcamento)" disabled>
                            </div>
                        </div>
                        <label>Total Opcionais</label>
                        <input type="text" v-model="valorOpcionais">


                        <h4>Pagamento</h4><br>
                        <label>Tipo</label>
                        <input type="text" v-model="formaPagamento.tipo" disabled>
                        <label>Sinal</label>
                        <input type="text" v-model="valorSinal" disabled v-if="formaPagamento.valorSinal !== 0">
                        <label v-if="formaPagamento.numeroParcelas !== 0">Número Parcelas</label>
                        <input type="text" v-model="numeroParcelas" disabled v-if="formaPagamento.numeroParcelas !== 0">
                        <label v-if="formaPagamento.numeroParcelasEntrada !== 0">Numero Parcelas</label>
                        <input type="text" v-model="numeroParcelasEntrada" disabled
                            v-if="formaPagamento.numeroParcelasEntrada !== 0">
                        <label>Valor Parcelas</label>
                        <input type="text" v-model="valorParcela" disabled v-if="formaPagamento.valorParcela !== 0">
                        <label v-if="formaPagamento.numeroParcelasEntrada !== 0">Saldo</label>
                        <input type="text" v-model="saldo" disabled v-if="formaPagamento.numeroParcelasEntrada !== 0">




                    </div>
                </div>
            </div>

            <div class="form-group">
                <button class="submit-button" @click="gerarPDF">Visualizar PDF</button>
            </div>

        </form>
    </div>


</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatarValorMonetario } from '@/common/utils/Helper';
import instance from '@/common/utils/AuthService';
import { Cliente, Contrato } from '@/common/utils/Interfaces/Contrato/ContratoDetalhes';
import { formatarData, formatarDataExtenso } from '@/common/utils/Helper/Data';
import { FormaPagamento, OrcamentoOpcional } from '@/common/utils/Interfaces/Orcamento';
import { CardapioInfo, GroupedItem, Opcional } from '@/common/utils/Interfaces';
import { gerarPDFDoHtml } from '@/common/utils/pdfService';


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
            datahoje: '',

            dataHojeRaw: '',
            dataUmMes: '',
            dataEventoMenos15: '',

            //Cliente
            id: '',
            nome: '',
            email: '',
            cidade: '',
            telefone: '',
            numero: '',
            patrocinado: '',
            idOrcamento: 0,
            idContrato: 0,
            idFormaPagamento: 0,
            formaPagamentoEscolhida: {} as FormaPagamento,

            contratantes: [] as Cliente[],
            //Data
            data: '',
            dataEventoRaw: '',

            //Orçamento
            convidados: '',
            convReaj: '',
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
            cardapioSelecionado: {} as CardapioInfo,
            cardapioBuffet: '',
            cardapioBuffetId: 0,
            valorCardapio: '',

            //Cerveja
            tipoBebida: '',
            tipoBebidaId: 0,


            valorCerveja: '',
            valorPorPessoaBuffet: '',
            valorPorPessoaBuffetReaj: '',
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
            valorEntrada: '',
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

                const hoje = new Date();
                const umMesDepois = new Date();
                umMesDepois.setMonth(hoje.getMonth() + 1);

                this.dataHojeRaw = formatarData(hoje.toISOString()); // Formata a data atual
                this.dataUmMes = formatarData(umMesDepois.toISOString()); // Formata a data de um mês à frente

                // Pega a data do evento e calcula 15 dias antes
                const dataEvento = new Date(contrato.Orcamento.dataEvento);
                const dataMenos15 = new Date(dataEvento);
                dataMenos15.setDate(dataEvento.getDate() - 15);

                this.dataEventoMenos15 = formatarData(dataMenos15.toISOString());
                this.dataEventoRaw = formatarData(contrato.Orcamento.dataEvento)
                this.data = formatarDataExtenso(contrato.Orcamento.dataEvento)

                this.nome = contrato.Orcamento.Lead.nomeLead
                this.telefone = contrato.Orcamento.Lead.celular
                this.cidade = contrato.Orcamento.Lead.cidade
                this.patrocinado = contrato.Orcamento.patrocinado ? "Sim" : "Não"
                this.contratantes = contrato.Cliente
                this.idContrato = contrato.idContrato
                this.idOrcamento = contrato.Orcamento.idOrcamento
                this.idFormaPagamento = contrato.FormaPagamento_idFormaPagamento

                this.referencia = contrato.Orcamento.referenciaOrcamento
                this.tipoEvento = contrato.Orcamento.tipoEvento
                this.valorEspaco = formatarValorMonetario(contrato.Orcamento.valorEspacoFinal)

                this.convidados = contrato.Orcamento.numConvidados.toString()
                this.convReaj = (contrato.Orcamento.numConvidados * 0.2).toString()
                this.totalProposta = formatarValorMonetario(contrato.Orcamento.valorTotalOrcamento)

                this.cardapioBuffet = contrato.Orcamento.Cardapio.nomeCardapio
                this.cardapioSelecionado = await this.fetchCardapioDetails(contrato.Orcamento.Cardapio_idCardapio)
                this.valorCardapio = formatarValorMonetario(contrato.Orcamento.valorPPCardapio)
                this.tipoBebida = contrato.Orcamento.Cerveja.nome
                this.valorCerveja = formatarValorMonetario(contrato.Orcamento.valorPPCerveja)
                this.valorPorPessoaBuffet = formatarValorMonetario(contrato.Orcamento.valorPPCardapio + contrato.Orcamento.valorPPCerveja)
                this.valorPorPessoaBuffetReaj = formatarValorMonetario(
                    Math.round((contrato.Orcamento.valorPPCardapio + contrato.Orcamento.valorPPCerveja) * 1.2)
                );
                this.valorTotalBuffet = formatarValorMonetario((contrato.Orcamento.valorPPCardapio + contrato.Orcamento.valorPPCerveja) * contrato.Orcamento.numConvidados)

                this.opcionaisSelecionados = contrato.Orcamento.Orcamento_Opcional
                this.valorOpcionais = formatarValorMonetario(contrato.Orcamento.valorOpcionais)

                this.cardapioBar = contrato.Orcamento.CardapioBar.nomeCardapioBar
                this.valorPorPessoaBar = formatarValorMonetario(contrato.Orcamento.valorPPBar)
                this.valorTotalBar = formatarValorMonetario(contrato.Orcamento.valorPPBar * contrato.Orcamento.numConvidados)

                const formaPagamento = await instance.get<FormaPagamento>(`/contrato/formaPagamento/${contrato.FormaPagamento_idFormaPagamento}`);
                this.formaPagamento = formaPagamento.data;
                this.valorSinal = formatarValorMonetario(this.formaPagamento.valorSinal)
                this.numeroParcelas = this.formaPagamento.numeroParcelas.toString(),
                    this.valorEntrada = formatarValorMonetario(this.formaPagamento.valorEntrada),
                    this.numeroParcelasEntrada = this.formaPagamento.numeroParcelasEntrada.toString(),
                    this.valorParcela = formatarValorMonetario(this.formaPagamento.valorParcela),
                    this.saldo = formatarValorMonetario(this.formaPagamento.valorTotal - this.formaPagamento.valorEntrada - this.formaPagamento.valorSinal)


                this.valorTotal = formatarValorMonetario(this.formaPagamento.valorTotal)

            } catch (error) {
                console.error('Erro ao buscar detalhes do contrato:', error);
            } finally {
                this.loading = false;
            }
        },

        async gerarPDF() {
            try {
                const templatePath = '/template-contrato.html';
                const response = await fetch(templatePath);
                let template = await response.text();

                template = this.preencherTemplate(template);
                await gerarPDFDoHtml(template, this.referencia);
            } catch (error) {
                console.error('Erro ao gerar o PDF:', error);
            }
        },

        async fetchCardapioDetails(id: number): Promise<CardapioInfo> {
            this.loading = true;
            try {
                const response = await instance.get<CardapioInfo>('/buffet/cardapio/' + id);
                return response.data;
            } catch (error) {
                console.error('Erro ao buscar detalhes do cardápio:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        getItensDoGrupo(nomeGrupo: string) {
            if (!this.cardapioSelecionado || !Array.isArray(this.cardapioSelecionado.cardapio.itensAgrupados)) {
                return [];
            }
            const grupoEncontrado = this.cardapioSelecionado.cardapio.itensAgrupados.find(
                (grupo: GroupedItem) => grupo.grupo === nomeGrupo
            );
            return grupoEncontrado ? grupoEncontrado.itens : [];
        },

        preencherTemplate(template: string) {

            const opcionaisHtml = this.opcionaisSelecionados.map(opcional =>
                `• ${opcional.Opcional.nomeOpcional}: <strong>${formatarValorMonetario(opcional.valorOrcamento)}</strong>`
            ).join('<br>');

            const barHtml = this.cardapioBar
                ? `<p>• Cardápio Bar: ${this.cardapioBar}, ${this.valorPorPessoaBar} por pessoa</p>
                   <p>• Valor Total Bar: <strong>${this.valorTotalBar}</strong></p>`
                : '';

            const textoFormaPagamento = (() => {
                switch (this.formaPagamento.tipo) {
                    case 'Parcelado':
                        return ` Sinal de <strong>${this.valorSinal}</strong> em <strong>${this.dataHojeRaw}</strong> e <strong>${this.numeroParcelas} parcelas</strong> de <strong>${this.valorParcela}</strong>, com primeiro vencimento em <strong>${this.dataUmMes}</strong>.`;
                    case 'Entrada Parcelada':
                        return `Sinal de <strong>${this.valorSinal}</strong> em <strong>${this.dataHojeRaw}</strong>. Entrada de <strong>${this.valorEntrada}</strong>, em <strong>${this.numeroParcelasEntrada}x</strong> de <strong>${this.valorParcela}</strong> e saldo de <strong>${this.saldo}</strong> até <strong>${this.dataEventoMenos15}</strong>`;
                    case 'À vista':
                        return `Sinal de <strong>${this.valorSinal}</strong> em <strong>${this.dataHojeRaw}</strong> e pagamento à vista no valor de <strong>${this.valorTotal}</strong> até <strong>${this.dataUmMes}</strong>`;
                    default:
                        return 'Informações de pagamento não disponíveis.';
                }
            })();

            const contratantesHtml = this.contratantes.map(contratante =>
                `${contratante.nome}, portador do RG ${contratante.rg} e CPF ${contratante.cpf}, residente em ${contratante.rua}, ${contratante.numero}, ${contratante.cidade} - CEP ${contratante.cep}`
            );

            const contratantesFormatados = contratantesHtml.length > 1
                ? contratantesHtml.slice(0, -1).join(', ') + ' e ' + contratantesHtml.slice(-1)
                : contratantesHtml[0] || '';

            const assinaturasHtml = `
        <div class="assinaturas">
            ${this.contratantes.map(contratante => `
                <div class="assinatura">
                    <div class="linha"></div>
                    <p>${contratante.nome}</p>
                    <p>RG: ${contratante.rg}</p>
                </div>
            `).join('')}
            <div class="assinatura">
                <div class="linha"></div>
                <p>BSS SERVIÇOS ELÉTRICOS E LOCAÇÕES LTDA BADULAQUE ESPAÇO E BUFFET</p>
                <p>CNPJ: 01.757.991/0001-14</p>
            </div>
        </div>
    `;

            const gruposHTML = this.cardapioSelecionado.cardapio.grupos.map(grupo => {
                const itensDoGrupo = this.getItensDoGrupo(grupo.nomeGrupo);

                // Verifica se `itensDoGrupo` é um array válido e contém itens
                const itens = Array.isArray(itensDoGrupo) && itensDoGrupo.length > 0
                    ? itensDoGrupo.map((item: { name: string }) => `<span>${item.name}</span>`).join(', ')
                    : '<span>Itens não encontrados</span>';

                return `<p><strong>${grupo.nomeGrupo ? grupo.nomeGrupo : 'Grupo indefinido'} - ${grupo.qtdItens ? grupo.qtdItens : 0} opção(es)</strong> <br>${itens}</p>`;
            }).join('');

            return template
                .replace('{{id}}', this.id)
                .replace('{{contratantes}}', contratantesFormatados)
                .replace('{{referencia}}', this.referencia)
                .replace('{{nomeLead}}', this.nome)
                .replace('{{tipoEvento}}', this.tipoEvento)
                .replace('{{dataEvento}}', this.data)
                .replace('{{cerimoniaLocal}}', this.cerimonia)
                .replace('{{numConvidados}}', this.convidados)
                .replace('{{numConvidadosReaj}}', this.convReaj)
                .replace('{{cardapioBuffet}}', this.cardapioBuffet)
                .replace('{{valorPPBuffet}}', this.valorPorPessoaBuffet)
                .replace('{{valorPPBuffetReaj}}', this.valorPorPessoaBuffetReaj)
                .replace('{{tipoCerveja}}', this.tipoBebida)
                .replace('{{valorEspaco}}', this.valorEspaco)
                .replace('{{valorTotalBuffet}}', this.valorTotalBuffet)
                .replace('{{valorContrato}}', this.valorTotal)
                .replace('{{valorContratoClausula12}}', this.valorTotal)
                .replace('{{opcionaisSelecionados}}', opcionaisHtml)
                .replace('{{bardulaque}}', barHtml)
                .replace('{{assinaturas}}', assinaturasHtml)
                .replace('{{formaPagamento}}', textoFormaPagamento)

                //Declaracao
                .replace('{{assinaturasDeclaracao}}', assinaturasHtml)
                .replace('{{dataHoje}}', this.datahoje)

                //Nota Promissória
                .replace('{{nomeContratante}}', this.contratantes[0].nome)
                .replace('{{rgContratante}}', this.contratantes[0].rg)
                .replace('{{cpfContratante}}', this.contratantes[0].cpf)
                .replace('{{enderecoContratante}}', this.contratantes[0].rua + ", " + this.contratantes[0].numero + " - " + this.contratantes[0].cidade)
                .replace('{{dataEventoPromissoria}}', this.dataEventoRaw)
                .replace('{{assinaturasPromissoria}}', assinaturasHtml)
                .replace('{{dataHojePromissoria}}', this.datahoje)

                .replace('{{cardapioTitulo}}', this.cardapioBuffet)
                .replace('{{cardapio}}', gruposHTML)
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