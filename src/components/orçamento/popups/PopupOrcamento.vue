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
                </div>
                <div class="form-column">
                    <h4>Orçamento</h4><br>
                    <label>Tipo de Evento:</label>
                    <select v-model="tipoEvento" required>
                        <option value="">Selecione</option>
                        <option value="casamento">Casamento</option>
                        <option value="aniversario">Aniversário</option>
                        <option value="corporativo">Empresa</option>
                        <option value="bodas">Bodas</option>
                        <option value="15anos">15 Anos</option>
                    </select>
                    <label>Convidados:</label>
                    <input type="number" v-model="convidados" required>
                    <label>Data:</label>
                    <input type="date" v-model="data" required>
                    <label>Dia da Semana:</label>
                    <input disabled type="text" v-model="diadasemana" required>
                    <label>Cardápio:</label>
                    <select v-model="cardapio" required>
                        <option value="">Selecione</option>
                        <option value="vegetariano">Vegetariano</option>
                        <option value="churrasco">Churrasco</option>
                        <option value="buffet">Buffet</option>
                    </select>
                    <label>Cerveja:</label>
                    <select v-model="cerveja" required>
                        <option value="">Selecione</option>
                        <option value="lager">Lager</option>
                        <option value="ipa">IPA</option>
                        <option value="pilsen">Pilsen</option>
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
            convidados: '',
            data: '',
            cardapio: '',
            cerveja: '',
            barEnabled: false,
            bar: '',
            cerimonia: false,
            espacoNoiva: false,
            cabineFotos: false,
            observacoes: ''
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        submitForm() {
            // Lógica para submissão do formulário
            console.log({
                nome: this.nome,
                telefone: this.telefone,
                cidade: this.cidade,
                email: this.email,
                fonte: this.fonte,
                tipoEvento: this.tipoEvento,
                convidados: this.convidados,
                data: this.data,
                cardapio: this.cardapio,
                cerveja: this.cerveja,
                bar: this.barEnabled ? this.bar : 'Não selecionado',
                cerimonia: this.cerimonia,
                espacoNoiva: this.espacoNoiva,
                cabineFotos: this.cabineFotos,
                observacoes: this.observacoes
            });
            this.close();
        },
        calcularDiaDaSemana(dataString: string) {
            const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            const data = new Date(dataString + 'T00:00:00');
            return diasDaSemana[data.getUTCDay()];
        }
    },
    watch: {
        data(newValue) {
            if (newValue) {
                this.diadasemana = this.calcularDiaDaSemana(newValue);
            } else {
                this.diadasemana = '';
            }
        }
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
