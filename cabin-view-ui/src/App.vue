<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
  height: 100%;
  width: 100%;
  background-color: var(--cyan-100);
}

#app {
  display: block;
}
</style>
