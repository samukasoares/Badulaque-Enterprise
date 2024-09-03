<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="submitForm">
            <div class="form-row">
                <div class="form-column">
                    <h4>Cliente</h4><br>
                    <label>Nome:</label>
                    <input type="text" v-model="nome" required>
                    <label>Telefone:</label>
                    <input type="tel" v-model="telefone" required>
                    <label>Cidade:</label>
                    <input type="text" v-model="cidade" required>
                    <label>Email:</label>
                    <input type="email" v-model="email" required>
                    <label>Fonte:</label>
                    <select v-model="fonte" required>
                        <option value="">Selecione</option>
                        <option value="instagram">Instagram</option>
                        <option value="google">Google</option>
                        <option value="site">Site</option>
                        <option value="indicacao">Indicação</option>
                    </select>
                    <label>Referência:</label>
                    <input type="text" v-model="referencia" disabled required>
                </div>
                <div class="form-column">
                    <h4>Orçamento</h4><br>
                    <label>Tipo de Evento:</label>
                    <select v-model="tipoEvento" required>
                        <option value="">Selecione</option>
                        <option value="casamento">Casamento</option>
                        <option value="aniversario">Aniversário</option>
                        <option value="empresa">Empresa</option>
                        <option value="bodas">Bodas</option>
                        <option value="debutante">15 Anos</option>
                    </select>
                    <label>Convidados:</label>
                    <input type="number" v-model="convidados" required>
                    <label>Data:</label>
                    <input type="date" v-model="data" required>
                    <label>Dia da Semana:</label>
                    <input disabled type="text" v-model="diadasemana" required>
                    <label>Cardápio:</label>
                    <select v-model="cardapio" required>
                        <option v-for="cardapio in cardapios" :key="cardapio.idCardapio" :value="cardapio.idCardapio">{{
                            cardapio.nomeCardapio
                            }}
                        </option>
                    </select>
                    <label>Cerveja:</label>
                    <select v-model="cerveja" required>
                        <option v-for="cerveja in cervejas" :key="cerveja.idCerveja" :value="cerveja.nome">{{
                            cerveja.nome
                            }}
                        </option>
                    </select>
                    <label class="checkbox-bar-label">
                        <input type="checkbox" v-model="barEnabled"> Bar
                    </label>
                    <select v-model="bar" :disabled="!barEnabled" required>
                        <option v-for="bar in cardapioBar" :key="bar.idCardapioBar" :value="bar.idCardapioBar">{{
                            bar.nomeCardapioBar
                        }}
                        </option>
                    </select>
                </div>
                <div class="form-column">
                    <h4>Opcionais</h4><br>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="cerimonia">Cerimônia
                    </label>

                    <div v-for="opcional in opcionais" :key="opcional.idOpcional" class="checkbox-container">
                        <label class="checkbox-label">
                            <input type="checkbox" id="opcional.idOpcional" :value="opcional.nomeOpcional"
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
import { Cardapio, CardapioBar, Cerveja, Opcional } from '@/common/utils/Interfaces';
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
            convidados: '',
            data: '',
            cardapio: '' as number | string,
            cerveja: '',
            bar: '',
            observacoes: '',
            cerimonia: false,
            barEnabled: false,
            selectedOpcionais: [],
            cardapioBar: [] as CardapioBar[],
            cardapios: [] as Cardapio[],
            cervejas: [] as Cerveja[],
            opcionais: [] as Opcional[]
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        submitForm() {
            // Lógica para submissão do formulário
            this.close();
        },
        calcularDiaDaSemana(dataString: string) {
            const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            const data = new Date(dataString + 'T00:00:00');
            return diasDaSemana[data.getUTCDay()];
        },
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
        async fetchCardapios() {
            try {
                let response = await instance.get<Cardapio[]>('/buffet/cardapios');
                this.cardapios = response.data
            } catch (error) {
                console.error('Erro ao buscar cardápios:', error);
            }
        },
        async fetchCervejas() {
            try {
                let response = await instance.get<Cerveja[]>('/cerveja/get-all');
                this.cervejas = response.data
            } catch (error) {
                console.error('Erro ao buscar cervejas:', error);
            }
        },
        async fetchCardapioBar() {
            try {
                let response = await instance.get<CardapioBar[]>('/bar/get-all');
                this.cardapioBar = response.data
            } catch (error) {
                console.error('Erro ao buscar cervejas:', error);
            }
        },

        async fetchOpcionais() {
            try {
                let response = await instance.get<Opcional[]>('/opcional/get-all')
                this.opcionais = response.data
            } catch (error) {
                console.error('Erro ao buscar opcionais:', error);
            }
        }
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
    mounted() {
        this.fetchCardapios();
        this.fetchCervejas();
        this.fetchCardapioBar();
        this.fetchOpcionais();
    }
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>
