<template>
<SidebarMenu/>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import SidebarMenu  from './components/SidebarMenu.vue'

export default defineComponent({
  name: 'App',
  components: {SidebarMenu},
  data() {
    return {
      name: 'Link',
      age: 25
    }
  }, 

  methods:{
    changeName(name: string){
      this.name =name 
      return name
    }
  }
});
</script>

<style>

</style>
