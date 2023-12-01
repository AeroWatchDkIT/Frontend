<template>
  <div class="table-page-container">
    <Button
      class="back-button"
      icon="pi pi-arrow-left"
      text
      rounded
      aria-label="Filter"
      @click="$router.push('/')"
    />
    <TheTable />
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
}
</style>
