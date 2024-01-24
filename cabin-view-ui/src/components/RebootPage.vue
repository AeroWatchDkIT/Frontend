<template>
  <div class="reboot-container">
    <h1 class="name">PalletSync Systems</h1>
    <i class="pi pi-spin pi-spinner spinner"></i>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.reboot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.name {
  margin: 0rem;
  font-weight: 400;
}
.spinner {
  margin-top: 1.5rem;
  font-size: 5rem;
  display: flex;
  justify-content: center;
}
</style>
