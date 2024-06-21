import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Orcamento from '@/components/orçamento/TelaOrcamento.vue'
import HomePage from '@/components/home/HomePage.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '',
    component: HomePage
  },
  {
    path: '/orcamentos',
    name: 'orcamentos',
    component: Orcamento
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 
