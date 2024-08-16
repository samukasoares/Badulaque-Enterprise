<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
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
                        <input v-model="contratante.rg">
                        <label>CEP:</label>
                        <input v-model="contratante.cep" @blur="fetchAddress(index)">
                        <label>Rua:</label>
                        <input v-model="contratante.rua" disabled>
                        <label>Bairro:</label>
                        <input v-model="contratante.bairro" disabled>
                    </div>
                    <div class="form-column">
                        <label>CPF:</label>
                        <input v-model="contratante.cpf">
                        <label>Cidade:</label>
                        <input v-model="contratante.cidade" disabled>
                        <label>Número:</label>
                        <input v-model="contratante.numero">
                    </div>
                </div>
            </div>

            <button type="button" class="botao-add" @click="addContratante">adicionar novo contratante...</button>
            <button class="submit-button" type="submit">Criar Contrato</button>
        </form>
    </div>
</template>

<script lang="ts">
export default {
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
            ]
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
                            alert('CEP não encontrado!');
                        }
                    } else {
                        alert('Erro ao buscar o CEP!');
                    }
                } catch (error) {
                    console.error('Erro na requisição:', error);
                    alert('Erro ao buscar o CEP!');
                }
            } else {
                alert('CEP inválido!');
            }
        },
        close() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css';
</style>
