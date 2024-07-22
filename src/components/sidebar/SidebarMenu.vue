<script>
import SidebarLink from './SidebarLink'
import { collapsed, toggleSidebar, sidebarWidth } from './state'

export default {
    props: {},
    components: { SidebarLink },
    setup() {
        return { collapsed, toggleSidebar, sidebarWidth }
    }
}
</script>

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

        <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSidebar">
            <i class="fas fa-angle-double-left"></i>
        </span>
    </div>
</template>

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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    /* Drop shadow */
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    /* Altura padrão */
    transition: height 0.3s ease;
}

.logo-container.expanded {
    height: 200px;
    /* Altura quando expandida */
}

.links-container {
    margin-top: 0.5em;
    /* Espaço entre o logotipo e os links */
    transition: margin-top 0.3s ease;
}


.sidebar h1 {
    height: 2.5em;
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
