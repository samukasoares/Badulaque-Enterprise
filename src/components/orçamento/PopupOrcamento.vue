<template>
    <div class="backdrop" @click.self="close">
        <form @submit.prevent="submitForm">
            <div class="form-row">
                <div class="form-column">
                    <h4>Cliente</h4><br>
                    <label>Nome:</label>
                    <input type="text" required>
                    <label>Telefone:</label>
                    <input type="tel" required>
                    <label>Cidade:</label>
                    <input type="text" required>
                    <label>Email:</label>
                    <input type="email" required>
                    <label>Fonte:</label>
                    <select required>
                        <option value="">Selecione</option>
                        <option value="internet">Internet</option>
                        <option value="amigos">Amigos</option>
                        <option value="tv">TV</option>
                    </select>
                </div>
                <div class="form-column">
                    <h4>Orçamento</h4><br>
                    <label>Tipo de Evento:</label>
                    <select required>
                        <option value="">Selecione</option>
                        <option value="casamento">Casamento</option>
                        <option value="aniversario">Aniversário</option>
                        <option value="corporativo">Corporativo</option>
                    </select>
                    <label>Convidados:</label>
                    <input type="number" required>
                    <label>Data:</label>
                    <input type="date" required>
                    <label>Cardápio:</label>
                    <select required>
                        <option value="">Selecione</option>
                        <option value="vegetariano">Vegetariano</option>
                        <option value="churrasco">Churrasco</option>
                        <option value="buffet">Buffet</option>
                    </select>
                    <label>Cerveja:</label>
                    <select required>
                        <option value="">Selecione</option>
                        <option value="lager">Lager</option>
                        <option value="ipa">IPA</option>
                        <option value="pilsen">Pilsen</option>
                    </select>
                    <label class="checkbox-bar-label">
                        <input type="checkbox" v-model="barEnabled"> Bar
                    </label>
                    <select :disabled="!barEnabled" required>
                        <option value="">Selecione</option>
                        <option value="completo">Completo</option>
                        <option value="basico">Básico</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
                <div class="form-column checkboxes-column">
                    <label class="checkbox-label">
                        <input type="checkbox"> Cerimônia
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox"> Espaço da Noiva
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox"> Cabine de Fotos
                    </label>
                </div>
            </div>
            <label>Observações</label>
            <input type="text">
            <button type="submit" class="submit-button">Enviar</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            barEnabled: false
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.close();
        }
    }
}
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
