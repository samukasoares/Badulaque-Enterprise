<template>
    <div class="backdrop" @click.self="close">
        <form>
            <h4>Criar Item</h4><br>
            <label>Nome:</label>
            <input type="text" required v-model="nome">
            <label>Base Receita:</label>
            <input type="number" required v-model="baseReceita">
            <label>Preço:</label>
            <input type="number" required v-model="preco">
            <label>Tipo:</label>
            <input type="text" required v-model="tipo">
            <label>Grupo:</label>
            <select v-model="grupo">
                <option v-for="grupo in grupos" :key="grupo.idGrupo" :value="grupo.idGrupo">{{ grupo.nomeGrupo }}
                </option>
            </select>
            <button type="submit" class="submit-button" @click="criarItem">Criar</button>
        </form>
    </div>

</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { defineComponent } from 'vue';

interface Grupo {
    nomeGrupo: string;
    idGrupo: number;
}

export default defineComponent({
    data() {
        return {
            grupos: [] as Grupo[],
            nome: '',
            baseReceita: '',
            preco: '',
            tipo: '',
            grupo: '' as number | string
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async fetchGrupos() {
            try {
                let response = await instance.get<Grupo[]>('/buffet/grupos');
                this.grupos = response.data
            } catch (error) {
                console.error('Erro ao buscar grupos:', error);
            }
        },
        async criarItem() {
            try {
                const data = await instance.post('/buffet/criar-item', {
                    nomeItem: this.nome,
                    baseReceita: this.baseReceita,
                    preco: this.preco,
                    tipo: this.tipo,
                    Grupo_idGrupo: this.grupo
                });
                window.location.reload()
            } catch (error) {
                alert('Erro ao criar item!')
            }
        }
    },
    mounted() {
        this.fetchGrupos();
    }
}
);
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
    /* Garanta que o formulário esteja acima do backdrop */
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
    /* Ajuste o z-index para garantir que o backdrop esteja acima de outros conteúdos */
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