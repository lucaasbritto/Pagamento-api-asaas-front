<template>
  <v-app>
    <AppBar></AppBar>
    <div class="main-content">
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar.vue';

export default {
  name: 'App',
  components: {
    AppBar
  },

  data: () => ({

  }),
}
</script>

<style>
.main-content {
  padding-top: 64px;
}
</style>
