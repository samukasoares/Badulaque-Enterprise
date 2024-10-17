<template>
    <div class="backdrop" @click.self="close">
        <form @submit.prevent="atualizarValor">
            <h4>{{ diaDaSemana }}</h4><br>

            <label>Valor:</label>
            <input type="number" required v-model.number="valorAtual">

            <button type="submit" class="submit-button">Atualizar</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ValorEspaco } from '@/common/utils/Interfaces';

export default defineComponent({
    props: {
        diaDaSemana: {
            type: String,
            required: true
        },
        valorEspaco: {
            type: Object as PropType<ValorEspaco>,
            required: true
        }
    },
    data() {
        return {
            valorAtual: this.valorEspaco.valor
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async atualizarValor() {
            if (this.valorAtual !== this.valorEspaco.valor) {
                try {
                    this.$emit('update', {
                        ...this.valorEspaco,
                        valor: this.valorAtual
                    });
                    this.close();
                    alert('Valor alterado com sucesso!')

                } catch (error) {
                    console.error('Erro ao atualizar o valor do espaço:', error);
                }
            } else {
                this.close();
            }
        }
    }
});
</script>

<style scoped>
form {
    max-width: 400px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    z-index: 2;
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

.backdrop {
    top: 0;
    left: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 1;
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
    font-family: Montserrat;
}

button.submit-button:hover {
    background-color: #2F4036;
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
</style>