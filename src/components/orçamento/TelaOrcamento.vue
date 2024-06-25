<template>
    <h1>Página Orçamentos</h1>
    <button @click="showModal = true">Novo Orçamento</button>
    <PopupOrcamento v-if="showModal" @close="showModal = false" />
</template>

<script>
import PopupOrcamento from '@/components/orçamento/PopupOrcamento.vue'

export default {
    components: { PopupOrcamento },
    data() {
        return {
            showModal: false
        };
    }
}
</script>