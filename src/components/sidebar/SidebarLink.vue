<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { collapsed } from './state'

export default {
    props: {
        to: { type: String, required: true },
        icon: { type: String, required: true },
        disabled: { type: Boolean, default: false }
    },
    setup(props) {
        const route = useRoute()
        const isActive = computed(() => route.path === props.to)
        return { isActive, collapsed }
    }
}
</script>

<template>
    <div v-if="disabled" class="link disabled">
        <!-- Renderiza como texto quando desativado -->
        <i class="icon" :class="icon"></i>
        <transition name="fade">
            <span v-if="!collapsed">
                <slot></slot>
            </span>
        </transition>
    </div>
    <router-link v-else :to="to" class="link" :class="{ active: isActive }">
        <!-- Renderiza como link quando não está desativado -->
        <i class="icon" :class="icon"></i>
        <transition name="fade">
            <span v-if="!collapsed">
                <slot></slot>
            </span>
        </transition>
    </router-link>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.link {
    display: flex;
    align-items: center;

    cursor: pointer;
    position: relative;
    font-weight: 400;
    user-select: none;

    margin: 0.1em 0;
    padding: 0.4em;
    border-radius: 0.25em;
    height: 1.5em;

    color: white;
    text-decoration: none;
}

.link:hover {
    background-color: var(--sidebar-item-hover);
}

.link.active {
    background-color: var(--sidebar-item-active);
}

.link .icon {
    flex-shrink: 0;
    width: 25px;
    margin-right: 10px;
}
</style>