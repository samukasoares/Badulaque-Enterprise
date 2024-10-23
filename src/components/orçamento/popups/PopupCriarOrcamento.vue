<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="submitForm">
            <div class="form-row">
                <div class="form-column">
                    <h4>Cliente</h4><br>
                    <label>Tipo de Evento:</label>
                    <select v-model="tipoEvento" required>
                        <option value="" disabled>Selecione</option>
                        <option value="Casamento">Casamento</option>
                        <option value="Aniversario">Aniversário</option>
                        <option value="Empresa">Empresa</option>
                        <option value="Bodas">Bodas</option>
                        <option value="Debutante">15 Anos</option>
                    </select>
                    <label>Fonte:</label>
                    <select v-model="fonte" required>
                        <option value="" disabled>Selecione</option>
                        <option value="instagram">Instagram</option>
                        <option value="google">Google</option>
                        <option value="site">Site</option>
                        <option value="indicacao">Indicação</option>
                    </select>
                    <label>Nome:</label>
                    <input type="text" v-model="nome" required>
                    <label>Email:</label>
                    <input type="email" v-model="email" required>
                    <label>Telefone:</label>
                    <input type="tel" v-model="telefone" @input="formatTelefone" required>
                    <label>Cidade:</label>
                    <select v-model="cidade" required>
                        <option value="" disabled>Selecione uma cidade</option>
                        <option v-for="cidade in cidades" :key="cidade.id" :value="cidade.nome">{{ cidade.nome }}
                        </option>
                    </select>


                </div>
                <div class="form-column">
                    <h4>Orçamento</h4><br>
                    <label>Convidados:</label>
                    <input type="number" v-model="convidados" required>
                    <label>Data:</label>
                    <input type="date" v-model="data" required>
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
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="cerimonia">Cerimônia
                    </label>

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
            <button type="submit" class="submit-button">Enviar</button>
        </form>
    </div>

</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { fetchCardapioBar, fetchCardapios, fetchCervejas, fetchCidades, fetchOpcionais } from '@/common/utils/FetchMethods';
import { Cardapio, CardapioBar, Cerveja, Opcional, RegistroLead, RegistroOrcamento, RegistroOrcamentoData } from '@/common/utils/Interfaces';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PopupOrcamento',
    data() {
        return {
            nome: '',
            telefone: '',
            cidade: '',
            email: '',
            fonte: '',
            tipoEvento: '',
            diadasemana: '',
            referencia: '',
            convidados: 0,
            data: '',
            cardapio: null,
            cerveja: 0,
            bar: null,
            observacoes: '',
            cerimonia: null,
            barEnabled: false,
            selectedOpcionais: [],

            //Armazena todos os registros
            cardapioBar: [] as CardapioBar[],
            cardapios: [] as Cardapio[],
            cervejas: [] as Cerveja[],
            opcionais: [] as Opcional[],
            cidades: [] as { id: number, nome: string }[],


            //Armazena o item selecionado
            cardapioSelecionado: {} as Cardapio,
            cervejaSelecionada: {} as Cerveja,
            barSelecionado: {} as CardapioBar,

        };
    },
    methods: {
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

        //Envio do formulário e criação do orçamento
        async submitForm() {
            const valorDiaDaSemana = this.calcularDiaDaSemanaValor(this.data);

            const lead: RegistroLead = {
                nomeLead: this.nome,
                celular: this.telefone,
                email: this.email,
                cidade: this.cidade
            }

            const orcamentoData: RegistroOrcamentoData = {
                referenciaOrcamento: this.referencia,
                Cardapio_idCardapio: this.cardapioSelecionado.idCardapio,
                CardapioBar_idCardapioBar: this.barSelecionado.idCardapioBar,
                Cerveja_idCerveja: this.cervejaSelecionada.idCerveja,
                numConvidados: this.convidados,
                observacoesOrcamento: this.observacoes,
                dataEvento: this.data,
                valorPPCardapio: this.cardapioSelecionado.precoCardapio,
                tipoEvento: this.tipoEvento,
                cerimoniaLocal: Number(this.cerimonia),
                fonte: this.fonte,
                valorPPBar: this.barSelecionado.precoCardapio,
                ValorEspaco_idValorEspaco: valorDiaDaSemana,
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
                alert('Erro ao criar orçamento!')
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
        }
    },
    async mounted() {
        this.cardapios = await fetchCardapios();
        this.cervejas = await fetchCervejas();
        this.cardapioBar = await fetchCardapioBar();
        this.opcionais = await fetchOpcionais();
        this.cidades = await fetchCidades();
    }
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>
