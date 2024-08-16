<template>
    <div v-if="visible" class="error-message">
        {{ message }}
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';

export default defineComponent({
    name: 'ErrorMessage',
    props: {
        message: {
            type: String as PropType<string>,
            required: true
        },
        duration: {
            type: Number as PropType<number>,
            default: 5000 // Duração padrão de 5 segundos
        }
    },
    setup(props) {
        const visible = ref(false);

        watch(() => props.message, (newMessage) => {
            if (newMessage) {
                visible.value = true;
                setTimeout(() => {
                    visible.value = false;
                }, props.duration);
            }
        });

        return {
            visible
        };
    }
});
</script>

<style scoped>
.error-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffdddd;
    color: #d8000c;
    padding: 10px;
    border: 1px solid #d8000c;
    border-radius: 5px;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 80%;
    text-align: center;
}
</style>
