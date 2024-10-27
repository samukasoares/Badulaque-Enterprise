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

                        <label>Fonte:</label>
                        <input v-model="fonte" disabled type="text">

                        <label>Data:</label>
                        <template v-if="!isEditing">
                            <input v-model="data" disabled type="text">
                        </template>
                        <template v-else>
                            <input v-model="dataEventoRaw" :disabled="!isEditing" type="date">
                        </template>

                        <label>Convidados:</label>
                        <input v-model="convidados" :disabled="!isEditing" type="text">
                        <label>Total Proposta:</label>
                        <input class="valorTotal" v-model="totalProposta" disabled type="text">


                    </div>

                    <div class="form-column">
                        <h4>Espaço</h4><br>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Valor:</label>
                                <input class="valorTotal" v-model="valorEspaco" :disabled="!isEditing" type="text">
                            </div>
                            <div class="form-item">
                                <label>Cerimônia no Local:</label>
                                <input v-model="cerimonia" :disabled="!isEditing" type="text">
                            </div>
                        </div>

                        <h4>Buffet</h4><br>
                        <div class="form-group">

                            <div class="form-item">
                                <label>Cardápio:</label>
                                <template v-if="!isEditing">
                                    <input v-model="cardapioBuffet" disabled type="text">
                                </template>
                                <template v-else>
                                    <select v-model="cardapioBuffetId" :disabled="!isEditing"
                                        @change="onCardapioSelect">
                                        <option v-for="cardapio in cardapios" :key="cardapio.idCardapio"
                                            :value="cardapio.idCardapio">
                                            {{ cardapio.nomeCardapio }}
                                        </option>
                                    </select>
                                </template>
                            </div>

                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorCardapio" :disabled="!isEditing" type="text">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="form-item">
                                <label>Cerveja:</label>
                                <template v-if="!isEditing">
                                    <input v-model="tipoBebida" disabled type="text">
                                </template>
                                <template v-else>
                                    <select v-model="tipoBebidaId" :disabled="!isEditing" @change="onCervejaSelect">
                                        <option v-for="cerveja in cervejas" :key="cerveja.idCerveja"
                                            :value="cerveja.idCerveja">
                                            {{ cerveja.nome }}
                                        </option>
                                    </select>
                                </template>
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorCerveja" :disabled="!isEditing" type="text">
                            </div>
                        </div>

                        <label>Total Valor Por Pessoa:</label>
                        <input v-model="valorPorPessoaBuffet" disabled type="text">
                        <label>Total Buffet:</label>
                        <input class="valorTotal" v-model="valorTotalBuffet" disabled type="text">



                        <h4>BAR</h4><br>
                        <div class="form-group">
                            <div class="form-item">
                                <label>Cardápio:</label>
                                <template v-if="!isEditing">
                                    <input v-model="cardapioBar" disabled type="text">
                                </template>
                                <template v-else>
                                    <select v-model="tipoBarId" :disabled="!isEditing" @change="onBarSelect">
                                        <option v-for="bar in cardapiosBar" :key="bar.idCardapioBar"
                                            :value="bar.idCardapioBar">
                                            {{ bar.nomeCardapioBar }}
                                        </option>
                                    </select>
                                </template>
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorPorPessoaBar" :disabled="!isEditing" type="text">
                            </div>
                        </div>
                        <label>Total Bar:</label>
                        <input disabled class="valorTotal" v-model="valorTotalBar">


                    </div>

                    <div class="form-column">
                        <h4>Controle</h4><br>
                        <label>Data Criação:</label>
                        <input v-model="dataCriação" disabled type="text">
                        <label>Data Envio:</label>
                        <input v-model="dataEnvio" disabled type="text">



                        <div>
                            <h4>Opcionais</h4>
                            <button type="button" @click="adicionarOpcional" :disabled="!isEditing">+</button>
                            <br>
                            <div v-for="(opcional, index) in opcionaisSelecionados" :key="index">
                                <label>{{ opcional.Opcional.nomeOpcional }}:</label>
                                <button type="button" class="botao-remover" v-if="isEditing"
                                    @click="removerOpcional(index)">Remover</button>
                                <input v-model="opcional.valorOrcamento" :disabled="!isEditing" type="text">

                            </div>
                            <label>Total Opcionais</label>
                            <input disabled class="valorTotal" v-model="valorTotalOpcionais">

                            <div v-if="isEditing">
                                <label>Novos Opcionais</label>
                                <div v-for="(opcional, index) in opcionaisAdicionados" :key="index" class="form-group">
                                    <select v-model="opcional.Opcional_idOpcional"
                                        @change="onOpcionalSelected(opcional.Opcional_idOpcional, index)">
                                        <option v-for="opcionalItem in opcionais" :key="opcionalItem.idOpcional"
                                            :value="opcionalItem.idOpcional">
                                            {{ opcionalItem.nomeOpcional }}
                                        </option>
                                    </select>

                                    <!-- Campo de input para inserir o valor do opcional selecionado -->
                                    <input v-model="opcional.valor" type="text">
                                </div>

                            </div>

                        </div>


                        <h4>Observações</h4>
                        <input v-model="observacoes" :disabled="!isEditing" type="text" class="textarea">


                    </div>

                    <div class="form-column">
                        <h4>Forma de Pagamento 1</h4><br>
                        <label>Sinal:</label>
                        <input v-model="sinalParcelado" :disabled="!isEditing">
                        <div class="form-group">
                            <div class="form-item">
                                <label>Parcelas:</label>
                                <input v-model="parcelasParcelado" :disabled="!isEditing">
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorParcelas" disabled>
                            </div>
                        </div>


                        <h4>Forma de Pagamento 2</h4><br>
                        <label>Sinal:</label>
                        <input v-model="sinalEntrada" :disabled="!isEditing">
                        <div class="form-group">
                            <div class="form-item">
                                <label>Qtd. Parcelas Entrada:</label>
                                <input v-model="parcelasEntrada" :disabled="!isEditing">
                            </div>
                            <div class="form-item">
                                <label>Valor:</label>
                                <input v-model="valorEntrada" :disabled="!isEditing">
                            </div>
                        </div>
                        <label>Saldo:</label>
                        <input v-model="saldoEntrada" disabled>

                        <h4>Forma de Pagamento 3</h4><br>
                        <label>Sinal:</label>
                        <input v-model="sinalAVista" :disabled="!isEditing">
                        <label>Valor:</label>
                        <input v-model="valorAVista" disabled>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <button class="submit-button" @click="gerarPDF">Visualizar PDF</button>
                <button class="submit-button" @click="toggleEditMode">Editar</button>
                <button class="submit-button" :disabled="!isEditing" @click="saveChanges">Salvar</button>
            </div>

        </form>

        <NotificationMessage :message="message" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cardapio, CardapioBar, Cerveja, Opcional, RegistroLead } from '@/common/utils/Interfaces';
import NotificationMessage from '@/views/NotificationMessage.vue';
import instance from '@/common/utils/AuthService';
import { Orcamento, OrcamentoOpcional } from '@/common/utils/Interfaces/Orcamento';
import { formatarDataExtenso, formatarDateToString } from '@/common/utils/Helper/Data';
import { formatarCelular, formatarValorMonetario } from '@/common/utils/Helper';
import { gerarPDFDoHtml } from '@/common/utils/pdfService';
import { fetchCardapioBar, fetchCardapios, fetchCervejas, fetchOpcionais } from '@/common/utils/FetchMethods';
import { OpcionaisFormatados, UpdateFormaPagamento, UpdateOrcamento } from '@/common/utils/Interfaces/Orçamento/UpdateOrcamento';


export default defineComponent({
    props: {
        orcamentoId: {
            type: Number,
            required: false,
            default: null,
        },
    },
    components: { NotificationMessage },
    data() {
        return {
            //Cliente
            id: '',
            nome: '',
            email: '',
            cidade: '',
            telefone: '',
            fonte: '',
            leadId: '',

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
            valorEspacoId: 0,
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
            tipoBarId: 0,

            valorNoiva: '',
            valorCabine: '',
            valorOpcionais: '',
            loading: false,
            isEditing: false,


            opcionaisSelecionados: [] as OrcamentoOpcional[],
            valorTotalOpcionais: '',

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

            //Objetos que armazenam todas as opções
            cardapios: [] as Cardapio[],
            cervejas: [] as Cerveja[],
            cardapiosBar: [] as CardapioBar[],

            opcionais: [] as Opcional[],
            opcionaisAdicionados: [] as OpcionaisFormatados[],

            showOpcionalSelect: false,
            novoOpcionalId: 0,

            message: ''
        };
    },

    methods: {
        close() {
            this.$emit('close');
        },

        formatarValorMonetario,

        removerFormatacaoMonetaria(valor: string): number {
            return parseFloat(valor.replace(/[^\d,-]/g, '').replace(',', '.'));
        },

        toggleEditMode() {
            this.isEditing = !this.isEditing;
        },

        async saveChanges() {

            const UpdateOpcionais = [
                // Primeiro, mapeia os opcionais já selecionados
                ...this.opcionaisSelecionados.map((opcional) => ({
                    Opcional_idOpcional: opcional.Opcional.idOpcional,
                    valorOrcamento: this.removerFormatacaoMonetaria(opcional.valorOrcamento.toString()),
                    porPessoa: opcional.Opcional.porPessoa
                })),
                // Depois, mapeia os opcionais recentemente adicionados
                ...this.opcionaisAdicionados.map((opcional) => ({
                    Opcional_idOpcional: opcional.Opcional_idOpcional,
                    valorOrcamento: this.removerFormatacaoMonetaria(opcional.valor),
                    porPessoa: opcional.porPessoa
                })),
            ];

            const lead: RegistroLead = {
                nomeLead: this.nome,
                celular: this.telefone,
                email: this.email,
                cidade: this.cidade
            }



            const formasPagamento: UpdateFormaPagamento[] = [
                {
                    nParcelas: parseInt(this.parcelasParcelado, 10),
                    type: 'Parcelado',
                    valorParcela: Number(this.removerFormatacaoMonetaria(this.valorParcelas)),
                    valorSinal: Number(this.removerFormatacaoMonetaria(this.sinalParcelado))
                },
                {
                    nParcelas: parseInt(this.parcelasEntrada, 10),
                    type: 'Entrada Parcelada',
                    valorParcela: Number(this.removerFormatacaoMonetaria(this.valorEntrada)),
                    valorSinal: Number(this.removerFormatacaoMonetaria(this.sinalEntrada))
                },
                {
                    nParcelas: 1,
                    type: 'À Vista',
                    valorParcela: Number(this.removerFormatacaoMonetaria(this.valorAVista)),
                    valorSinal: Number(this.removerFormatacaoMonetaria(this.sinalAVista))
                }
            ];

            const formattedDate = new Date(this.dataEventoRaw).toISOString();

            const orcamento = {
                idOrcamento: parseInt(this.id),
                referenciaOrcamento: this.referencia,
                Cardapio_idCardapio: this.cardapioBuffetId,
                CardapioBar_idCardapioBar: this.tipoBarId,
                Cerveja_idCerveja: this.tipoBebidaId,
                numConvidados: parseInt(this.convidados),
                observacoesOrcamento: this.observacoes,
                dataEvento: formattedDate,
                ValorEspaco_idValorEspaco: this.valorEspacoId,
                valorPPBar: this.removerFormatacaoMonetaria(this.valorPorPessoaBar),
                valorPPCardapio: this.removerFormatacaoMonetaria(this.valorCardapio),
                tipoEvento: this.tipoEvento,
                cerimoniaLocal: this.cerimonia === 'Sim' ? 1 : 0,
                fonte: this.fonte,
                Lead_idLead: parseInt(this.leadId),
                valorEspacoFinal: this.removerFormatacaoMonetaria(this.valorEspaco),  // Valor final do espaço
                valorOpcionais: this.removerFormatacaoMonetaria(this.valorTotalOpcionais),  // Valor total dos opcionais
                valorPPCerveja: this.removerFormatacaoMonetaria(this.valorCerveja),  // Valor por pessoa da cerveja
            };

            const updateOrcamento: UpdateOrcamento = {
                orcamento: orcamento,
                formasPagamento: formasPagamento,
                lead: lead,
                opcionais: UpdateOpcionais,
            };

            console.log(updateOrcamento)



            try {
                const data = await instance.put('/orcamento/update', updateOrcamento)
                this.message = 'Orçamento atualizado com sucesso!';

                // Atualiza as informações no modal
                if (this.orcamentoId) {
                    await this.fetchOrcamentoDetails(this.orcamentoId);
                }
            } catch (error) {
                alert('Erro ao atualizar orçamento!')
            }
        },

        removerOpcional(index: number) {
            this.opcionaisSelecionados.splice(index, 1);
        },


        async onCardapioSelect() {
            // Obtém o cardápio selecionado
            const selectedCardapio = this.cardapios.find(cardapio => cardapio.idCardapio === this.cardapioBuffetId);

            if (selectedCardapio) {
                try {
                    // Fazer uma chamada para buscar o valor reajustado do cardápio selecionado
                    const response = await instance.post('/buffet/cardapio/reajustes', {
                        ano: this.calcularDiferencaAnos(this.dataEventoRaw) // Ou o ano que deseja usar para o cálculo do reajuste
                    });

                    const reajustes = response.data;

                    // Encontrar o cardápio reajustado com base no ID selecionado
                    const cardapioReajustado = reajustes.find((item: any) => item.cardapio === selectedCardapio.nomeCardapio);

                    if (cardapioReajustado) {
                        // Atualizar o valor do cardápio com o valor reajustado
                        this.valorCardapio = formatarValorMonetario(cardapioReajustado.reajuste);
                    } else {
                        // Se o cardápio não foi encontrado na resposta, usa o valor original
                        this.valorCardapio = formatarValorMonetario(selectedCardapio.precoCardapio);
                    }
                } catch (error) {
                    console.error('Erro ao obter valor reajustado:', error);
                    // Em caso de erro, manter o valor original
                    this.valorCardapio = formatarValorMonetario(selectedCardapio.precoCardapio);
                }
            }
        },

        async onCervejaSelect() {
            const selectedCerveja = this.cervejas.find(cerveja => cerveja.idCerveja === this.tipoBebidaId);

            if (selectedCerveja) {
                try {
                    const response = await instance.post('/cerveja/reajustes', {
                        ano: this.calcularDiferencaAnos(this.dataEventoRaw) // Ou o ano que deseja usar para o cálculo do reajuste
                    });

                    const reajustes = response.data;

                    // Encontrar o cardápio reajustado com base no ID selecionado
                    const cervejaReajustado = reajustes.find((item: any) => item.cerveja === selectedCerveja.nome);

                    if (cervejaReajustado) {
                        // Atualizar o valor do cardápio com o valor reajustado
                        this.valorCerveja = formatarValorMonetario(cervejaReajustado.reajuste);
                    } else {
                        // Se o cardápio não foi encontrado na resposta, usa o valor original
                        this.valorCerveja = formatarValorMonetario(cervejaReajustado.atual);
                    }
                } catch (error) {
                    console.error('Erro ao obter valor reajustado:', error);
                    // Em caso de erro, manter o valor original
                    this.valorCerveja = formatarValorMonetario(selectedCerveja.valor);
                }
            }
        },

        async onBarSelect() {
            const selectedBar = this.cardapiosBar.find(cardapioBar => cardapioBar.idCardapioBar === this.tipoBarId);

            if (selectedBar) {
                try {
                    const response = await instance.post('/bar/reajustes', {
                        ano: this.calcularDiferencaAnos(this.dataEventoRaw) // Ou o ano que deseja usar para o cálculo do reajuste
                    });

                    const reajustes = response.data;

                    // Encontrar o cardápio reajustado com base no ID selecionado
                    const barReajustado = reajustes.find((item: any) => item.cardapioBar === selectedBar.nomeCardapioBar);

                    if (barReajustado) {
                        // Atualizar o valor do cardápio com o valor reajustado
                        this.valorPorPessoaBar = formatarValorMonetario(barReajustado.reajuste);
                    } else {
                        // Se o cardápio não foi encontrado na resposta, usa o valor original
                        this.valorPorPessoaBar = formatarValorMonetario(barReajustado.atual);
                    }
                } catch (error) {
                    console.error('Erro ao obter valor reajustado:', error);
                    // Em caso de erro, manter o valor original
                    this.valorPorPessoaBar = formatarValorMonetario(selectedBar.precoCardapio);
                }
            }
        },

        adicionarOpcional() {
            // Adiciona um novo objeto com campos vazios para o select e o input
            this.opcionaisAdicionados.push({
                Opcional_idOpcional: 0, // Valor inicial para o select
                nomeOpcional: '',
                valor: '',
                porPessoa: 0,
            });
        },

        async onOpcionalSelected(opcionalId: number, index: number) {
            // Encontra o opcional selecionado
            const opcionalSelecionado = this.opcionais.find(op => op.idOpcional === opcionalId);

            if (opcionalSelecionado) {
                try {
                    const response = await instance.post('/opcional/reajustes', {
                        ano: this.calcularDiferencaAnos(this.dataEventoRaw)
                    });

                    const reajustes = response.data;

                    // Encontra o valor correspondente ao opcional selecionado
                    const valorReajustado = reajustes.find((item: any) => item.opcional === opcionalSelecionado.nomeOpcional);

                    if (valorReajustado) {
                        this.opcionaisAdicionados[index].valor = formatarValorMonetario(valorReajustado.reajuste);
                    } else {
                        this.opcionaisAdicionados[index].valor = formatarValorMonetario(opcionalSelecionado.valorAtual); // supondo que valorOpcional seja o valor original
                    }

                } catch (error) {
                    console.error('Erro ao obter o valor do opcional:', error);
                    this.opcionaisAdicionados[index].valor = 'Erro ao carregar valor';
                }
            }
        },

        calcularDiferencaAnos(data: string) {
            // Verificar se a data está no formato `yyyy-MM-dd`
            const [ano, mes, dia] = data.split('-').map(Number);

            if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
                console.error("Erro: Uma ou mais partes da data não são números.");
                return 0; // Retorna 0 como padrão se a data estiver inválida
            }

            // Criar um objeto Date com base na data fornecida
            const dataEvento = new Date(ano, mes - 1, dia); // Meses são indexados a partir de 0 em JavaScript

            // Obter o ano atual
            const anoAtual = new Date().getFullYear();

            // Calcular a diferença de anos
            const diferenca = dataEvento.getFullYear() - anoAtual;

            return diferenca;
        },

        calcularDiaDaSemanaValor(dataString: string) {
            const data = new Date(dataString + 'T00:00:00');
            const diaSemana = data.getUTCDay(); // Retorna o índice do dia da semana

            // Define o valor numérico com base no dia da semana
            if (diaSemana === 5) {
                return 1; // Sexta-feira
            } else if (diaSemana === 0) {
                return 2; // Domingo
            } else if (diaSemana === 6) {
                return 3; // Sábado
            } else {
                return 4; // Qualquer outro dia
            }
        },

        showError(message: string) {
            this.message = message;
        },

        toggleOpcionalSelect() {
            this.showOpcionalSelect = !this.showOpcionalSelect;
            this.novoOpcionalId = 0; // Reseta o valor selecionado
        },


        async fetchOrcamentoDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<Orcamento>('/orcamento/get/' + id);
                const orcamento = response.data;

                this.id = orcamento.idOrcamento.toString();
                this.leadId = orcamento.Lead_idLead.toString();
                this.nome = orcamento.Lead.nomeLead;
                this.email = orcamento.Lead.email;
                this.referencia = orcamento.referenciaOrcamento;
                this.fonte = orcamento.fonte;

                this.data = formatarDataExtenso(orcamento.dataEvento);
                this.dataEventoRaw = orcamento.dataEvento.slice(0, 10);

                this.valorEspacoId = this.calcularDiaDaSemanaValor(this.dataEventoRaw);

                this.tipoEvento = orcamento.tipoEvento;
                this.cidade = orcamento.Lead.cidade;
                this.telefone = formatarCelular(orcamento.Lead.celular);
                this.convidados = orcamento.numConvidados.toString();
                this.valorEspaco = formatarValorMonetario(orcamento.valorEspacoFinal);
                this.cardapioBuffet = orcamento.Cardapio.nomeCardapio;

                this.valorCardapio = formatarValorMonetario(orcamento.valorPPCardapio);
                this.cardapioBuffetId = orcamento.Cardapio.idCardapio;

                this.tipoBebida = orcamento.Cerveja.nome;
                this.tipoBebidaId = orcamento.Cerveja.idCerveja;

                this.valorCerveja = formatarValorMonetario(orcamento.valorPPCerveja);
                this.valorPorPessoaBuffet = formatarValorMonetario(orcamento.valorPPCardapio + orcamento.valorPPCerveja)
                this.valorTotalBuffet = formatarValorMonetario((orcamento.valorPPCardapio + orcamento.valorPPCerveja) * orcamento.numConvidados)
                this.cardapioBar = orcamento.CardapioBar.nomeCardapioBar;
                this.tipoBarId = orcamento.CardapioBar.idCardapioBar;
                this.valorPorPessoaBar = formatarValorMonetario(orcamento.valorPPBar);
                this.valorTotalBar = formatarValorMonetario(orcamento.valorPPBar * orcamento.numConvidados);
                this.totalProposta = formatarValorMonetario(orcamento.valorTotalOrcamento);
                this.observacoes = orcamento.observacoesOrcamento;
                this.dataCriação = formatarDateToString(orcamento.createdAt);
                this.dataEnvio = orcamento.enviadoEm ? formatarDateToString(orcamento.enviadoEm) : '-';
                this.cerimonia = orcamento.cerimoniaLocal === 1 ? 'Sim' : 'Não';

                this.opcionaisSelecionados = orcamento.Orcamento_Opcional;
                this.valorTotalOpcionais = formatarValorMonetario(orcamento.valorOpcionais);


                orcamento.FormaPagamento.forEach((forma) => {
                    if (forma.tipo === 'À Vista') {
                        this.sinalAVista = formatarValorMonetario(forma.valorSinal);
                        this.valorAVista = formatarValorMonetario(forma.valorTotal);
                    }

                    if (forma.tipo === 'Entrada Parcelada') {
                        this.sinalEntrada = formatarValorMonetario(forma.valorSinal);
                        this.parcelasEntrada = (forma.numeroParcelasEntrada).toString();
                        this.valorEntrada = formatarValorMonetario(forma.valorParcela);
                        this.saldoEntrada = formatarValorMonetario(forma.valorTotal - forma.valorEntrada);
                        this.valorParcelasEntrada = formatarValorMonetario(forma.valorParcela / forma.numeroParcelasEntrada);
                    }

                    if (forma.tipo === 'Parcelado') {
                        this.sinalParcelado = formatarValorMonetario(forma.valorSinal);
                        this.parcelasParcelado = (forma.numeroParcelas).toString();
                        this.valorParcelas = formatarValorMonetario(forma.valorParcela);
                    }
                })

            } catch (error) {
                console.error('Erro ao buscar detalhes do orçamento:', error);
            } finally {
                this.loading = false;
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

    async mounted() {
        this.cardapios = await fetchCardapios()
        this.cervejas = await fetchCervejas()
        this.cardapiosBar = await fetchCardapioBar()
        this.opcionais = await fetchOpcionais()
    },

    watch: {
        dataEventoRaw: {
            immediate: true,
            async handler(newDate: string) {
                if (newDate) {
                    this.valorEspacoId = this.calcularDiaDaSemanaValor(newDate);

                    // Atualizar valores automaticamente com base na nova data
                    await Promise.all([
                        this.onCardapioSelect(),
                        this.onCervejaSelect(),
                        this.onBarSelect()
                    ]);
                }
            },
        },
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