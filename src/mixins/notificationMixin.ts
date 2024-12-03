// notificationMixin.ts
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            message: '',
            messageType: 'success' as 'success' | 'error',
        };
    },
    methods: {
        showError(message: string) {
            this.message = message;
            this.messageType = 'error';
        },
        showSuccess(message: string) {
            this.message = message;
            this.messageType = 'success';
        },
    }
});