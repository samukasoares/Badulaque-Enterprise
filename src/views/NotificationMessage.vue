<template>
    <div v-if="visible" :class="['notification-message', typeClass]">
        {{ message }}
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeUnmount, PropType } from 'vue';

export default defineComponent({
    name: 'NotificationMessage',
    props: {
        message: {
            type: String as PropType<string>,
            required: true
        },
        type: {
            type: String as PropType<'success' | 'error'>,
            default: 'success' // O tipo padrão será sucesso
        },
        duration: {
            type: Number as PropType<number>,
            default: 5000 // Duração padrão de 5 segundos
        }
    },
    setup(props) {
        const visible = ref(false);
        const typeClass = ref('');
        let timeoutId: number | null = null; // Controla o setTimeout

        // Função para exibir a notificação
        const showNotification = () => {
            visible.value = true;
            typeClass.value = props.type === 'success' ? 'success' : 'error';

            // Cancela o timeout anterior se houver
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }

            // Define um novo timeout para esconder a notificação
            timeoutId = window.setTimeout(() => {
                visible.value = false;
                timeoutId = null; // Limpa o timeoutId após esconder
            }, props.duration);
        };

        // Observa mudanças na mensagem
        watch(() => props.message, (newMessage) => {
            if (newMessage) {
                showNotification();
            }
        });

        // Limpa o timeout ao desmontar o componente
        onBeforeUnmount(() => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        });

        return {
            visible,
            typeClass
        };
    }
});
</script>

<style scoped>
.notification-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    border-radius: 5px;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 80%;
    text-align: center;
}

.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
</style>
