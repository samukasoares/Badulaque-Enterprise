<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="submitForm">
            <h4>Orçamento</h4>
            <!--
            <select v-model="orcamentoSelecionado" required>
                <option disabled value="">Selecione um orçamento...</option>
                <option v-for="orcamento in orcamentos" :key="orcamento.idOrcamento" :value="orcamento">
                    {{ orcamento.referenciaOrcamento }} - {{ orcamento.Lead.nomeLead }}
                </option>
            </select>
            -->

            <VueMultiselect v-model="orcamentoSelecionado" :options="orcamentos" :multiple="false"
                :close-on-select="true" :show-labels="false" :preserve-search="true"
                placeholder="Escolha o orçamento..." :custom-label="customLabel" track-by="idOrcamento"
                :preselect-first="false" :max-height="250"></VueMultiselect>


            <h4>Forma de Pagamento</h4>
            <VueMultiselect v-model="formaDePagamentoSelecionada" :options="formasDePagamento" :multiple="false"
                :close-on-select="true" :show-labels="false" :preserve-search="true"
                placeholder="Escolha a forma de pagamento..." :custom-label="customLabelFormaPagamento"
                track-by="idFormaPagamento" :preselect-first="false" :max-height="250">
            </VueMultiselect>
            <!--
                <select v-model="formaDePagamentoSelecionada" required>
                <option disabled value="">Selecione uma forma de pagamento...</option>
                <option v-for="formaPagamento in formasDePagamento" :key="formaPagamento.idFormaPagamento"
                    :value="formaPagamento">
                    {{ formaPagamento.tipo }}
                </option>
            </select>
            -->


            <h4>Observações</h4>
            <input type="text" v-model="observacoes">

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

    <!--Mensagens de Erro Validacao CEP, CPF e RG-->
    <NotificationMessage :message="message" type="error" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotificationMessage from '@/views/NotificationMessage.vue';
import { FormaPagamento, OrcamentoBasico } from '@/common/utils/Interfaces/Orcamento';
import { fetchOrcamentosEnviados } from '@/common/utils/FetchMethods';
import { ContratoFullData, RegistroCliente, RegistroContrato } from '@/common/utils/Interfaces/Contrato/RegistroContrato';
import instance from '@/common/utils/AuthService';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css'; // Importar o estilo aqui

export default defineComponent({
    components: {
        NotificationMessage, VueMultiselect
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

            observacoes: '',
            orcamentoSelecionado: {} as OrcamentoBasico,
            formaDePagamentoSelecionada: {} as FormaPagamento,
            formasDePagamento: [] as FormaPagamento[],
            orcamentos: [] as OrcamentoBasico[],

            message: ''
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
        customLabel(option: OrcamentoBasico) {
            return option && option.Lead && option.Lead.nomeLead
                ? `${option.referenciaOrcamento} - ${option.Lead.nomeLead}`
                : '';
        },

        customLabelFormaPagamento(option: FormaPagamento) {
            return option && option.tipo ? option.tipo : '';
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
                            this.message = "CEP não encontrado!";
                        }
                    } else {
                        this.message = "Erro ao buscar CEP!";
                    }
                } catch (error) {
                    this.message = "Erro ao buscar CEP!";
                }
            } else {
                this.message = "CEP inválido!";
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
                this.message = "CPF Inválido!";
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
                this.message = "RG Inválido!";
                this.contratantes[index].rg = '';
            }
        },
        async fetchFormasDePagamento(idOrcamento: number): Promise<FormaPagamento[]> {
            try {
                const response = await instance.get<FormaPagamento[]>('/contrato/formasPagamento/' + idOrcamento);
                this.formasDePagamento = response.data;
                return response.data; // Retorna as formas de pagamento
            } catch (error) {
                this.message = "Erro ao buscar formas de pagamento!";
                return []; // Retorna um array vazio em caso de erro
            }
        },
        close() {
            this.$emit('close');
        },
        async submitForm() {

            if (!this.orcamentoSelecionado || !this.orcamentoSelecionado.idOrcamento) {
                this.message = "Por favor, selecione um orçamento!";
                return;
            }

            const contrato: RegistroContrato = {
                assinado: 0,
                Orcamento_idOrcamento: this.orcamentoSelecionado.idOrcamento,
                observacoes: this.observacoes,
                FormaPagamento_idFormaPagamento: this.formaDePagamentoSelecionada.idFormaPagamento,
                valorNF: 0,
            };

            const clientes: RegistroCliente[] = this.contratantes.map((contratante) => ({
                cep: contratante.cep,
                cidade: contratante.cidade,
                cpf: contratante.cpf,
                nome: contratante.nome,
                rg: contratante.rg,
                rua: contratante.rua,
                numero: contratante.numero
            }));

            const contratoFullData: ContratoFullData = {
                contrato: contrato,
                clientes: clientes,
                orcamento: { referenciaOrcamento: this.orcamentoSelecionado.referenciaOrcamento }
            };
            try {
                const data = await instance.post('/contrato/create', contratoFullData)
                this.$emit('success', 'Contrato criado com sucesso!');
                this.close(); // Fecha o modal após o sucesso
            } catch (error) {
                alert('Erro ao criar contrato!')
            }

        },
        showError(message: string) {
            this.message = message;
        },
    },
    async mounted() {
        this.orcamentos = await fetchOrcamentosEnviados()
    },
    watch: {
        async orcamentoSelecionado(newOrcamento) {
            if (newOrcamento && newOrcamento.idOrcamento) {
                this.formasDePagamento = await this.fetchFormasDePagamento(newOrcamento.idOrcamento);
            }
        }
    }
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css';
@import 'vue-multiselect/dist/vue-multiselect.css';
</style>