<template>
    <div class="sidebar" :style="{ width: sidebarWidth }">
        <div class="logo-container" :class="{ 'expanded': !collapsed }">
            <span v-if="collapsed">
                <img :src="require('@/assets/logos/MenuSmall.png')" alt="Menu Small" width="38px">
            </span>
            <span v-else>
                <img :src="require('@/assets/logos/MenuFull.png')" alt="Menu Full" width="150px">
            </span>
        </div>

        <div class="links-container">
            <SidebarLink to="/" icon="fas fa-home">Home</SidebarLink>
            <SidebarLink to="/orcamentos" icon="fa-solid fa-file-invoice-dollar">Orçamentos</SidebarLink>
            <SidebarLink to="/contratos" icon="fa-solid fa-file-signature">Contratos</SidebarLink>
            <SidebarLink to="/clientes" icon="fa-solid fa-user-group">Clientes</SidebarLink>
            <SidebarLink to="/buffet" icon="fa-solid fa-utensils">Buffet</SidebarLink>
            <SidebarLink to="/bardulaque" icon="fa-solid fa-martini-glass">Bardulaque</SidebarLink>
            <SidebarLink to="/parametros" icon="fa-solid fa-gear">Parâmetros</SidebarLink>
            <SidebarLink to="/relatorios" icon="fa-solid fa-file-lines">Relatórios</SidebarLink>
        </div>

        <!-- Novo container de usuário -->
        <div class="user-container">
            <!-- Exibe o nome do usuário usando SidebarLink desativado -->
            <SidebarLink to="" icon="fa-solid fa-user" :disabled="true">{{ username }}</SidebarLink>
            <!-- Botão de Logout que aparece no hover -->
            <div class="logout" @click="logout">
                <i class="fas fa-sign-out-alt"></i> Logout
            </div>
        </div>

        <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSidebar">
            <i class="fas fa-angle-double-left"></i>
        </span>
    </div>
</template>

<script>
import instance from '@/common/utils/AuthService';
import SidebarLink from './SidebarLink';
import { collapsed, toggleSidebar, sidebarWidth } from './state';

export default {
    components: { SidebarLink },
    data() {
        return {
            username: '', // Inicializa o username como string vazia
            collapsed,
            sidebarWidth,
        };
    },
    created() {
        // Recupera o nome do usuário do localStorage quando o componente é criado
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            this.username = storedUsername;
        }
    },
    methods: {
        toggleSidebar() {
            toggleSidebar();
        },
        async logout() {
            try {
                await instance.post('/logout');
                localStorage.clear(); // Limpa todo o localStorage ao fazer logout
                this.$router.push('/');
            } catch (error) {
                alert('Erro ao deslogar!');
            }
        }
    }
};
</script>

<style>
:root {
    --sidebar-bg-color: #425C4D;
    --sidebar-item-hover: #2F4036;
    --sidebar-item-active: #2F4036;
}

.sidebar {
    color: white;
    background-color: var(--sidebar-bg-color);
    float: left;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0.5em;
    transition: 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    transition: height 0.3s ease;
}

.logo-container.expanded {
    height: 200px;
}

.links-container {
    margin-top: 0.5em;
    transition: margin-top 0.3s ease;
    flex-grow: 1;
}

.user-container {
    position: relative;
    padding: 1em 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 2em;
}

.user-container .logout {
    display: none;
    position: absolute;
    bottom: 50px;
    left: 0;
    padding: 0.5em 2em;
    cursor: pointer;
    background-color: #2F4036;
    color: white;
    width: auto;
    text-align: center;
    border-radius: 4px;
    transition: background-color 0.5s ease;
    font-size: 1em;
    white-space: nowrap;
}

.user-container:hover .logout {
    display: block;
}

.user-container .logout:hover {
    background-color: var(--sidebar-item-hover);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
}

.collapse-icon {
    position: absolute;
    bottom: 0;
    padding: 0.75em;
    color: rgba(255, 255, 255, 0.7);
    transition: 0.2s linear;
    cursor: pointer;
}

.rotate-180 {
    transform: rotate(180deg);
    transition: 0.2s linear;
}
</style>
