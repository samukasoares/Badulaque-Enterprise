import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Orcamento from '@/components/orçamento/TelaOrcamento.vue'
import HomePage from '@/components/home/TelaHome.vue'
import Cliente from '@/components/cliente/TelaCliente.vue'
import Buffet from '@/components/buffet/TelaBuffet.vue'
import Bardulaque from '@/components/bardulaque/TelaBardulaque.vue'
import Relatorios from '@/components/relatorios/TelaRelatorios.vue'
import Contrato from '@/components/contrato/TelaContrato.vue'
import DetalhesOrcamento from '@/components/orçamento/DetalhesOrcamento.vue'
import Parametros from '@/components/parametros/telaParametros.vue'
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
    component: Orcamento,
    meta: { requiresAuth: true }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: Cliente,
    meta: { requiresAuth: true }
  },
  {
    path: '/buffet',
    name: 'buffet',
    component: Buffet,
    meta: { requiresAuth: true }
  },
  {
    path: '/bardulaque',
    name: 'bardulaque',
    component: Bardulaque,
    meta: { requiresAuth: true }
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: Relatorios,
    meta: { requiresAuth: true }
  },
  {
    path: '/contratos',
    name: 'contratos',
    component: Contrato,
    meta: { requiresAuth: true }
  },
  {
    path: '/parametros',
    name: 'parametros',
    component: Parametros,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/*
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica se o token está presente no localStorage
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' }); // Redireciona para a página de login se não estiver autenticado
  } else {
    next(); // Permite a navegação
  }
});

*/
export default router 
