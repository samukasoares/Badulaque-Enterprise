<template>
    <form @submit.prevent="loginUser">
        <caption>
            <img :src="require('@/assets/logos/MenuFullVerde.png')" alt="Menu Full" width="150px">
        </caption>
        <label>Entrar</label>
        <input type="text" placeholder="Email" name="email" id="email" v-model="email">
        <input type="password" placeholder="Senha" name="password" id="password" v-model="password">
        <button class="btn-Enviar">Entrar</button>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios, { AxiosError } from 'axios';


export default defineComponent({
    data() {
        return {
            email: '',
            password: '',
            username: '',
        }
    },
    components: {},
    methods: {
        async loginUser() {
            try {
                const response = await axios.post('http://localhost:3001/login', {
                    email: this.email,
                    senha: this.password,
                });

                const token = response.data.token;
                const username = response.data.user.username;

                localStorage.setItem('token', token);   // Armazena o token no localStorage
                localStorage.setItem('username', username)
                this.$router.push('/orcamentos');       // Redireciona para a rota após o login
            } catch (error) {
                console.error('Erro ao fazer login:', error);
            }
        },
    }
})
</script>

<style scoped>
caption {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

label {
    display: flex;
    justify-content: center;
}

form {
    background-color: #E1C59C;

    min-width: 20%;
    padding: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    box-shadow: 2px 2px 2px #49494988;
}

input {
    border-radius: 5px;
    width: 100%;
    height: 40px;
    border: 1px solid gainsboro;
    padding: 5px;
}

input:focus {
    outline: none;
    border-color: #E1C59C;
    box-shadow: 0 0 10px #2F4036;
}

form label,
input,
button {
    margin: 5px;
    max-width: auto;
}

button {
    padding: 5px;
    height: 40px;
    width: 100%;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    background-color: #425C4D;
    color: white;
    font: bold;
}

button:hover {
    background-color: #2F4036;
}

button:focus {
    cursor: progress;
}

a {
    color: #425C4D;
    display: flex;
    justify-content: center;
    font-size: 15px;
    text-decoration: none;
}
</style>