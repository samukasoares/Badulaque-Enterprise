<template>
  <div :style="{ display: 'flex' }">
    <SidebarMenu />
    <div :style="{ marginLeft: sidebarWidth, padding: '20px', width: '100%' }">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarMenu from './components/sidebar/SidebarMenu.vue'
import { sidebarWidth } from '@/components/sidebar/state'

export default defineComponent({
  name: 'App',
  components: { SidebarMenu },
  data() {
    return {}
  },

  setup() {
    return { sidebarWidth }
  },

  methods: {
  }
}
);
</script>

<style></style>
