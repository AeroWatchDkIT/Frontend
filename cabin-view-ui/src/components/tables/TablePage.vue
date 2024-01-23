<template>
  <div class="table-page-container">
    <TheTable class="table" />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import TheTable from "./TheTable.vue";
</script>

<style lang="scss" scoped>
.back-button {
  position: absolute;
  top: 2%;
  left: 2%;
  width: 3rem;
  height: 3rem;
  z-index: 1;
}

.table {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
}
</style>
