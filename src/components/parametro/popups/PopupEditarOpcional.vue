<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="atualizarOpcional">
            <h4>{{ opcional.nomeOpcional }}</h4><br>
            <div class="valores-container">
                <div class="valor-item">
                    <label>{{ currentYear }}:</label>
                    <h4> R$ {{ reajuste.atual }},00</h4>
                </div>
                <div class="valor-item">
                    <label>{{ currentYear + 1 }}:</label>
                    <h4>R$ {{ reajuste.ano1 }},00</h4>
                </div>
                <div class="valor-item">
                    <label>{{ currentYear + 2 }}:</label>
                    <h4>R$ {{ reajuste.ano2 }},00</h4>
                </div>
            </div>

            <label>Valor:</label>
            <input type="number" required v-model="opcional.valorAtual">

            <label>Por Pessoa?</label><br>
            <input type="checkbox" v-model='porPessoaBoolean'>


            <button type="submit" class="submit-button">Atualizar</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import instance from '@/common/utils/AuthService';
import { Reajuste } from '@/common/utils/Interfaces/Helper';
import { Opcional } from '@/common/utils/Interfaces/Opcional/Opcional';
import { formatarValorMonetario } from '@/common/utils/Helper/Monetario';

export default defineComponent({
    props: {
        cardId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            opcional: {} as Opcional,
            loading: false,

            nomeCervejaAnterior: '',

            currentYear: new Date().getFullYear(),
            reajuste: {} as Reajuste
        };
    },
    computed: {
        porPessoaBoolean: {
            get(): boolean {
                return this.opcional.porPessoa === 1;
            },
            set(value: boolean) {
                this.opcional.porPessoa = value ? 1 : 0;
            }
        }
    },
    methods: {
        formatarValorMonetario,
        close() {
            this.$emit('close');
        },

        async fetchOpcionalDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<Opcional>('/opcional/get/' + id);
                this.opcional = response.data;

            } catch (error) {
                console.error('Erro ao buscar opcional:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchValoresOpcional(id: number) {
            try {
                const response = await instance.get<Reajuste>('opcional/reajuste/' + id);
                this.reajuste = response.data;
            } catch (error) {
                console.error('Erro ao buscar reajustes do opcional:', error);
            } finally {
                this.loading = false;
            }
        },

        async atualizarOpcional() {
            const valorOpcionalAtualizado: Opcional = {
                idOpcional: this.opcional.idOpcional,
                nomeOpcional: this.opcional.nomeOpcional,
                valorAtual: this.opcional.valorAtual,
                porPessoa: this.opcional.porPessoa
            }

            try {
                const data = await instance.post('opcional/update', valorOpcionalAtualizado)
                this.$emit('success', 'Opcional atualizado com sucesso!');
                this.close(); // Fecha o modal após o sucesso
            } catch (error) {
                this.$emit('error', 'Erro ao atualizar opcional!');
            }
        }


    },

    watch: {
        cardId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchOpcionalDetails(newId);
                    this.fetchValoresOpcional(newId);
                }
            }
        }
    }
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>