<template>
    <div class="backdrop" @click.self="close">
        <div class="modal">
            <div class="content">
                <div class="group">
                    <h4>Geral</h4>
                    <div class="formgroup">
                        <label>ID:</label>
                        <input disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Referência:</label>
                        <input disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Nome:</label>
                        <input type="text">
                    </div>
                    <div class="formgroup">
                        <label>Tipo de Evento:</label>
                        <input type="text">
                    </div>
                    <div class="formgroup">
                        <label>Data:</label>
                        <input v-model="data" type="date">
                    </div>
                    <div class="formgroup">
                        <label>Convidados:</label>
                        <input type="number">
                    </div>
                    <div class="formgroup">
                        <label>Total Proposta:</label>
                        <input disabled type="number">
                    </div>
                    <h4>Controle</h4>
                    <div class="formgroup">
                        <label>Data Envio:</label>
                        <input disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Hora Envio:</label>
                        <input disabled type="text">
                    </div>
                    <h4>Observações</h4>
                    <div class="formgroup">

                        <input type="text" class="textarea">
                    </div>

                </div>
                <div class="group">
                    <h4>Espaço</h4>
                    <div class="formgroup">
                        <label>Dia da Semana:</label>
                        <input disabled type="text" v-model="diadasemana">
                    </div>
                    <div class="formgroup">
                        <label>Valor:</label>
                        <input type="number">
                    </div>
                    <h4>Buffet</h4>
                    <div class="formgroup">
                        <label>Cardápio:</label>
                        <input type="text">
                    </div>
                    <div class="formgroup">
                        <label>Tipo de Bebida:</label>
                        <input type="text">
                    </div>
                    <div class="formgroup">
                        <label>Valor por pessoa:</label>
                        <input type="number">
                    </div>
                    <div class="formgroup">
                        <label>Valor Total:</label>
                        <input disabled type="text">
                    </div>
                    <h4>BAR</h4>
                    <div class="formgroup">
                        <label>Cardápio:</label>
                        <input type="text">
                    </div>
                    <div class="formgroup">
                        <label>Valor por pessoa:</label>
                        <input type="number">
                    </div>
                    <div class="formgroup">
                        <label>Valor Total:</label>
                        <input disabled type="text">
                    </div>
                    <h4>Espaço da Noiva</h4>
                    <div class="formgroup">
                        <label>Valor:</label>
                        <input type="number">
                    </div>
                    <h4>Cabine de Fotos/Plataforma 360</h4>
                    <div class="formgroup">
                        <label>Valor:</label>
                        <input type="number">
                    </div>
                </div>
            </div>
            <div class="formgroup">
                <button>Salvar</button>
            </div>


        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            diadasemana: '',
            data: '',
        };
    },
    methods: {
        close() {
            this.$emit('close');
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
})
</script>

<style scoped>
.modal {
    max-width: fit-content;
    margin: 30px auto;
    background: white;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    z-index: 2;
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

h4 {
    color: black;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

input {
    color: #000000;
    font-size: 0.6em;
    letter-spacing: 1px;
    font-weight: bold;
    border: 1px solid #aaa;
    border-radius: 5px;
    width: 150px;
}

label {
    color: #aaa;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #425C4D;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    font-family: Montserrat;
}

button:hover {
    background-color: #2F4036;
}

.content {
    display: flex;
}

.group {
    display: inline;
    margin-right: 10px;

}

.formgroup {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    margin-bottom: 2px;
}

.textarea {
    width: 100%;
    height: 60px;
    resize: none;
    border-radius: 5px;
}
</style>