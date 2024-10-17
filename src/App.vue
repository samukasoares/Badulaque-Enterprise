<template>
  <div :style="{ display: 'flex' }">
    <SidebarMenu v-if="showSidebar" />
    <div :style="{ marginLeft: sidebarWidth, padding: '20px', width: '100%' }">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import SidebarMenu from './components/sidebar/SidebarMenu.vue';
import { sidebarWidth } from '@/components/sidebar/state';

export default defineComponent({
  name: 'App',
  components: { SidebarMenu },

  setup() {
    const route = useRoute();
    const showSidebar = computed(() => route.name !== 'login');


    return { sidebarWidth, showSidebar };
  }
});
</script>

<style></style>
