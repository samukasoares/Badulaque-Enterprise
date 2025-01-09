<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>Criar Item</h4><br>
            <label>Nome:</label>
            <input type="text" required v-model="nome">
            <label>Unidade:</label>
            <select v-model="unidade">
                <option>Gramas</option>
                <option>Mililitros</option>
                <option>Unidades</option>
            </select>
            <label>Consumo Por Pessoa:</label>
            <input type="number" required v-model="consumoPorPessoa">
            <label>Base Receita:</label>
            <input type="number" required v-model="baseReceita">
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
import { primeiraLetraMaiscula } from '@/common/utils/Helper/Outros';
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
            unidade: '',
            baseReceita: '',
            consumoPorPessoa: '',
            grupo: '' as number | string
        };
    },
    methods: {
        primeiraLetraMaiscula,
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
                    unidade: this.unidade,
                    baseReceita: this.baseReceita,
                    consumoPorPessoa: this.consumoPorPessoa,
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
    },
    watch: {
        nome(newVal) {
            this.nome = primeiraLetraMaiscula(newVal);
        }
    }
}
);
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>