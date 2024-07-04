import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Orcamento from '@/components/orçamento/TelaOrcamento.vue'
import HomePage from '@/components/home/HomePage.vue'
import Cliente from '@/components/cliente/TelaCliente.vue'
import Buffet from '@/components/buffet/TelaBuffet.vue'
import Bardulaque from '@/components/bardulaque/TelaBardulaque.vue'
import Relatorios from '@/components/relatorios/TelaRelatorios.vue'
import Contrato from '@/components/contrato/TelaContrato.vue'
import Login from '@/components/login/TelaLogin.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/orcamentos',
    name: 'orcamentos',
    component: Orcamento
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: Cliente
  },
  {
    path: '/buffet',
    name: 'buffet',
    component: Buffet
  },
  {
    path: '/bardulaque',
    name: 'bardulaque',
    component: Bardulaque
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: Relatorios
  },
  {
    path: '/contratos',
    name: 'contratos',
    component: Contrato
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 
