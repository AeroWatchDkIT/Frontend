<template>
  <div class="app-container">
    <RouterView />
    <Toast position="top-center" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import { usePalletStatusStore } from "@/stores/palletStatusStore";
import type { PalletStatuses } from "@/types/palletStatus";
import Toast from "primevue/toast";

const palletStatusStore = usePalletStatusStore();
const palletStatus = ref([] as PalletStatuses[]);

onMounted(async () => {
  await palletStatusStore.loadData();
  palletStatus.value = palletStatusStore.palletStatus;
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
  height: 100%;
  width: 100%;
}

#app {
  display: block;
  padding: 0;
  overflow: hidden;
}
</style>
