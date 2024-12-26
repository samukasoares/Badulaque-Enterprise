<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="submitForm">
            <div class="form-row">
                <div class="form-column">
                    <h4>Cliente</h4><br>
                    <label>Tipo de Evento:</label>
                    <select v-model="tipoEvento" required>
                        <option value="Casamento">Casamento</option>
                        <option value="Aniversario">Aniversário</option>
                        <option value="Empresa">Empresa</option>
                        <option value="Bodas">Bodas</option>
                        <option value="Debutante">15 Anos</option>
                    </select>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="cerimonia">Cerimônia
                    </label>
                    <label>Fonte:</label>
                    <select v-model="fonte" required>
                        <option value="" disabled>Selecione</option>
                        <option value="instagram">Instagram</option>
                        <option value="google">Google</option>
                        <option value="site">Site</option>
                        <option value="indicacao">Indicação</option>
                    </select>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="patrocinado">Patrocinado
                    </label>
                    <label>Nome:</label>
                    <input type="text" v-model="nome" @input="formatNome" required>
                    <label>Email:</label>
                    <input type="email" v-model="email" required>
                    <label>Telefone:</label>
                    <input type="tel" v-model="telefone" @input="formatTelefone" required>

                    <div class="form-group">
                        <div class="form-item">
                            <label>Estado:</label>
                            <select v-model="estado" required>
                                <option value="" disabled>Estado</option>
                                <option v-for="estado in estados" :key="estado.id" :value="estado.sigla">{{ estado.sigla
                                    }}
                                </option>
                            </select>
                        </div>
                        <div class="form-item">
                            <label>Cidade:</label>
                            <select v-model="cidade" required>
                                <option value="" disabled>Selecione uma cidade...</option>
                                <option v-for="cidade in cidades" :key="cidade.id" :value="cidade.nome">{{ cidade.nome
                                    }}
                                </option>
                            </select>
                        </div>
                    </div>



                </div>
                <div class="form-column">
                    <h4>Orçamento</h4><br>
                    <label>Convidados:</label>
                    <input type="number" v-model="convidados" required>
                    <label>Data:</label>
                    <input type="date" v-model="data" required :min="dataMinima">
                    <label>Dia da Semana:</label>
                    <input disabled type="text" v-model="diadasemana" required>
                    <label>Cardápio:</label>
                    <select v-model="cardapioSelecionado" required>
                        <option v-for="cardapio in cardapios" :key="cardapio.idCardapio" :value="cardapio">{{
                            cardapio.nomeCardapio
                        }}
                        </option>
                    </select>
                    <label>Cerveja:</label>
                    <select v-model="cervejaSelecionada" required>
                        <option v-for="cerveja in cervejas" :key="cerveja.idCerveja" :value="cerveja">{{
                            cerveja.nome
                        }}
                        </option>
                    </select>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="barEnabled"> Bar
                    </label>
                    <select v-model="barSelecionado" :disabled="!barEnabled" required>
                        <option v-for="bar in cardapioBar" :key="bar.idCardapioBar" :value="bar">{{
                            bar.nomeCardapioBar
                            }}
                        </option>
                    </select>
                </div>
                <div class="form-column">
                    <label>Referência:</label>
                    <input type="text" v-model="referencia" disabled required>

                    <h4>Opcionais</h4><br>

                    <div v-for="opcional in opcionais" :key="opcional.idOpcional">
                        <label class="checkbox-label">
                            <input type="checkbox" id="opcional.idOpcional" :value="opcional.idOpcional"
                                v-model="selectedOpcionais" /> {{ opcional.nomeOpcional }}
                        </label>
                    </div>


                </div>
            </div>
            <label>Observações</label>
            <input type="text" v-model="observacoes">
            <button type="submit" class="submit-button">Gravar</button>
        </form>
    </div>

    <NotificationMessage :message="message" type="error" />

</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { fetchCardapioBar, fetchCardapios, fetchCervejas, fetchCidades, fetchEstados, fetchOpcionais } from '@/common/utils/FetchMethods';
import { Cardapio, CardapioBar, Cerveja, Opcional, RegistroLead, RegistroOrcamento, RegistroOrcamentoData } from '@/common/utils/Interfaces';
import notificationMixin from '@/mixins/notificationMixin';
import NotificationMessage from '@/views/NotificationMessage.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PopupOrcamento',
    components: { NotificationMessage },
    mixins: [notificationMixin],
    data() {

        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado, então adicionamos 1
        const dia = String(hoje.getDate()).padStart(2, '0');

        return {
            nome: '',
            telefone: '',
            cidade: '',
            estado: 'SP',
            email: '',
            fonte: '',
            tipoEvento: 'Casamento',
            patrocinado: 0,
            diadasemana: '',
            referencia: '',
            convidados: 0,
            data: '',
            dataMinima: `${ano}-${mes}-${dia}`,
            cardapio: null,
            cerveja: 0,
            bar: null,
            observacoes: '',
            cerimonia: null,
            barEnabled: false,
            selectedOpcionais: [],
            message: '',

            //Armazena todos os registros
            cardapioBar: [] as CardapioBar[],
            cardapios: [] as Cardapio[],
            cervejas: [] as Cerveja[],
            opcionais: [] as Opcional[],
            cidades: [] as { id: number, nome: string }[],
            estados: [] as { id: number, nome: string, sigla: string }[],


            //Armazena o item selecionado
            cardapioSelecionado: {} as Cardapio,
            cervejaSelecionada: {} as Cerveja,
            barSelecionado: null as CardapioBar | null,

        };
    },
    methods: {
        fetchCidades,
        close() {
            this.$emit('close');
        },

        //Formata Telefone dinamicamente no formato (##) #####-####
        formatTelefone(event: Event) {
            const target = event.target as HTMLInputElement;
            let input = target.value;
            input = input.replace(/\D/g, ''); // Remove caracteres não numéricos
            input = input.substring(0, 11);   // Limita a 11 dígitos

            if (input.length > 10) {
                input = input.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (input.length > 6) {
                input = input.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (input.length > 2) {
                input = input.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (input.length > 0) {
                input = input.replace(/^(\d*)/, '($1');
            }

            this.telefone = input;
        },

        formatNome() {
            this.nome = this.nome
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
        },

        //Envio do formulário e criação do orçamento
        async submitForm() {
            const valorDiaDaSemana = this.calcularDiaDaSemanaValor(this.data);

            const cidadeEstado = (this.cidade + " - " + this.estado)
            const lead: RegistroLead = {
                nomeLead: this.nome,
                celular: this.telefone,
                email: this.email,
                cidade: cidadeEstado
            }

            const orcamentoData: RegistroOrcamentoData = {
                referenciaOrcamento: this.referencia,
                Cardapio_idCardapio: this.cardapioSelecionado.idCardapio,
                CardapioBar_idCardapioBar: this.barSelecionado ? this.barSelecionado.idCardapioBar : null,
                Cerveja_idCerveja: this.cervejaSelecionada.idCerveja,
                numConvidados: this.convidados,
                observacoesOrcamento: this.observacoes,
                dataEvento: this.data,
                valorPPCardapio: this.cardapioSelecionado.precoCardapio,
                tipoEvento: this.tipoEvento,
                cerimoniaLocal: Number(this.cerimonia),
                fonte: this.fonte,
                valorPPBar: this.barSelecionado ? this.barSelecionado.precoCardapio : 0,
                ValorEspaco_idValorEspaco: valorDiaDaSemana,
                patrocinado: this.patrocinado ? 1 : 0
            }

            const orcamento: RegistroOrcamento = {
                orcamento: orcamentoData,
                opcional: this.selectedOpcionais,
                lead: lead
            }

            try {
                const data = await instance.post('/orcamento/create', orcamento)
                this.$emit('success', 'Orçamento criado com sucesso!');
                this.close(); // Fecha o modal após o sucesso
            } catch (error) {
                let errorMessage = 'Erro ao atualizar orçamento!';

                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response: { data: { message?: string } } };

                    // Captura a mensagem de erro personalizada do backend
                    if (axiosError.response?.data?.message) {
                        errorMessage = axiosError.response.data.message;
                    }
                }

                this.showError(errorMessage)
            }

        },

        //Recebe uma data e verifica o dia da Semana
        calcularDiaDaSemana(dataString: string) {
            const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            const data = new Date(dataString + 'T00:00:00');
            return diasDaSemana[data.getUTCDay()];
        },

        //Recebe uma data e verifica qual é o ID que deve ser enviado para o backend
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

        //Gera referência no formato CAAMMDD
        gerarReferencia() {
            if (this.tipoEvento && this.data) {
                const tipoEventoInicial = this.tipoEvento.charAt(0).toUpperCase();
                const data = new Date(this.data + 'T00:00:00');
                const ano = String(data.getUTCFullYear()).slice(-2);
                const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
                const dia = String(data.getUTCDate()).padStart(2, '0');
                this.referencia = `${tipoEventoInicial}${ano}${mes}${dia}`;
            }
        },
    },
    watch: {
        data(newValue) {
            if (newValue) {
                this.diadasemana = this.calcularDiaDaSemana(newValue);
                this.gerarReferencia();
            } else {
                this.diadasemana = '';
            }
        },
        tipoEvento(newValue) {
            if (newValue) {
                this.gerarReferencia();
            }
        },
        barEnabled(newValue) {
            if (!newValue) {
                this.barSelecionado = null; // Limpa o campo de seleção quando o checkbox é desmarcado
            }
        },
        async estado(newValue) {
            const estadoSelecionado = this.estados.find(e => e.sigla === newValue);
            if (estadoSelecionado) {
                // Carregar cidades com o id do estado selecionado
                this.cidades = await this.fetchCidades(estadoSelecionado.id);
            } else {
                // Limpar cidades se nenhum estado estiver selecionado
                this.cidades = [];
            }
        }
    },
    async mounted() {
        this.cardapios = await fetchCardapios();
        this.cervejas = await fetchCervejas();
        this.cardapioBar = await fetchCardapioBar();
        this.opcionais = await fetchOpcionais();
        this.estados = await fetchEstados();
        this.cidades = await this.fetchCidades(35);
    }
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>
