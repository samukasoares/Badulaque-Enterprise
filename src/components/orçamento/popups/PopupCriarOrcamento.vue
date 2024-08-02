<template>
    <div class="backdrop" @click.self="close">
        <form @submit.prevent="submitForm">
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
                        <option value="">Selecione</option>
                        <option value="completo">Completo</option>
                        <option value="basico">Básico</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
                <div class="form-column checkboxes-column">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="cerimonia"> Cerimônia
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="espacoNoiva"> Espaço da Noiva
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="cabineFotos"> Cabine de Fotos
                    </label>
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
import { Cardapio, Cerveja } from '@/common/utils/Interfaces';
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
            barEnabled: false,
            bar: '',
            cerimonia: false,
            espacoNoiva: false,
            cabineFotos: false,
            observacoes: '',

            cardapios: [] as Cardapio[],
            cervejas: [] as Cerveja[]
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
    }
});
</script>

<style scoped>
form {
    max-width: 700px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    z-index: 2;
    /* Garanta que o formulário esteja acima do backdrop */
}

.form-row {
    display: flex;
    justify-content: space-between;
}

.form-column {
    flex: 1;
    padding: 0 10px;
}

.checkboxes-column {
    margin-top: 60px;
    /* Ajuste conforme necessário para alinhar com "Orçamento" */
}

label {
    color: #aaa;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

.checkbox-bar-label {
    display: flex;
    align-items: center;
    margin: 25px 0 5px;
}

h4 {
    color: black;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

input,
select {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
}

input[type="checkbox"] {
    width: auto;
    margin-right: 10px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    margin: 10px 0;
}

button.submit-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #425C4D;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
}

button.submit-button:hover {
    background-color: #2F4036;
}

.backdrop {
    top: 0;
    left: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 1;
    /* Ajuste o z-index para garantir que o backdrop esteja acima de outros conteúdos */
}
</style>
