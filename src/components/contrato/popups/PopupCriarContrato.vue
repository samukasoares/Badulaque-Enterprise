<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="submitForm">
            <h4>Orçamento</h4>
            <select>
                <option>Samuel & Bruna - C250922</option>
                <option>Nemli & Nemlerey - C250922</option>
            </select>
            <h4>Dados Contratante</h4><br>

            <div v-for="(contratante, index) in contratantes" :key="index" class="contratante-section">
                <label>Nome Contratante:</label>
                <input v-model="contratante.nome" type="text" required>
                <div class="form-row">
                    <div class="form-column">
                        <label>RG:</label>
                        <input v-model="contratante.rg" @input="formatRG(index)" @blur="validateRG(index)">
                        <label>CPF:</label>
                        <input v-model="contratante.cpf" @input="formatCPF(index)" @blur="validateCPF(index)">
                        <label>CEP:</label>
                        <input v-model="contratante.cep" @blur="fetchAddress(index)">
                        <label>Cidade:</label>
                        <input v-model="contratante.cidade" disabled>
                    </div>
                    <div class="form-column">
                        <label>Bairro:</label>
                        <input v-model="contratante.bairro" disabled>
                        <label>Rua:</label>
                        <input v-model="contratante.rua" disabled>
                        <label>Número:</label>
                        <input v-model="contratante.numero">
                    </div>
                </div>
            </div>

            <button type="button" class="botao-add" @click="addContratante">Adicionar novo contratante...</button>
            <button class="submit-button" type="submit">Criar Contrato</button>
        </form>
    </div>
    <ErrorMessage :message="errorMessage" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ErrorMessage from '../../../views/ErrorMessage.vue'

export default defineComponent({
    components: {
        ErrorMessage
    },
    data() {
        return {
            contratantes: [
                {
                    nome: '',
                    rg: '',
                    cpf: '',
                    cep: '',
                    rua: '',
                    bairro: '',
                    cidade: '',
                    numero: ''
                }
            ],
            errorMessage: ''
        };
    },
    methods: {
        addContratante() {
            this.contratantes.push({
                nome: '',
                rg: '',
                cpf: '',
                cep: '',
                rua: '',
                bairro: '',
                cidade: '',
                numero: ''
            });
        },
        async fetchAddress(index: number) {
            const cep = this.contratantes[index].cep.replace(/\D/g, ''); // Remove caracteres não numéricos

            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    if (response.ok) {
                        const data = await response.json();
                        if (!data.erro) {
                            this.contratantes[index].rua = data.logradouro;
                            this.contratantes[index].bairro = data.bairro;
                            this.contratantes[index].cidade = data.localidade;
                        } else {
                            this.errorMessage = "CEP não encontrado!";
                        }
                    } else {
                        this.errorMessage = "Erro ao buscar CEP!";
                    }
                } catch (error) {
                    this.errorMessage = "Erro ao buscar CEP!";
                }
            } else {
                this.errorMessage = "CEP inválido!";
                this.contratantes[index].cep = '';
            }
        },
        formatCPF(index: number) {
            let cpf = this.contratantes[index].cpf.replace(/\D/g, '');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            this.contratantes[index].cpf = cpf;
        },
        validateCPF(index: number) {
            const cpf = this.contratantes[index].cpf.replace(/\D/g, '');
            if (cpf.length !== 11 || !this.isValidCPF(cpf)) {
                this.errorMessage = "CPF Inválido!";
                this.contratantes[index].cpf = '';
            }
        },
        isValidCPF(cpf: string) {
            let sum = 0;
            let remainder;
            if (cpf == "00000000000") return false;
            for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
            remainder = (sum * 10) % 11;
            if (remainder == 10 || remainder == 11) remainder = 0;
            if (remainder != parseInt(cpf.substring(9, 10))) return false;
            sum = 0;
            for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
            remainder = (sum * 10) % 11;
            if (remainder == 10 || remainder == 11) remainder = 0;
            if (remainder != parseInt(cpf.substring(10, 11))) return false;
            return true;
        },
        formatRG(index: number) {
            let rg = this.contratantes[index].rg.replace(/\D/g, '');
            rg = rg.replace(/(\d{2})(\d)/, '$1.$2');
            rg = rg.replace(/(\d{3})(\d)/, '$1.$2');
            rg = rg.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            this.contratantes[index].rg = rg;
        },
        validateRG(index: number) {
            const rg = this.contratantes[index].rg.replace(/\D/g, '');
            if (rg.length < 9) {
                this.errorMessage = "RG Inválido!";
                this.contratantes[index].rg = '';
            }
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            alert('Formulário enviado com sucesso!');
        },
        showError(message: string) {
            this.errorMessage = message;
        },
    }
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css';
</style>
