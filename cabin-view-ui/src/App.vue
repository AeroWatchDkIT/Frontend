<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import { usePalletStatusStore } from "@/stores/palletStatusStore";
import type { PalletStatuses } from "@/types/palletStatus";

const palletStatusStore = usePalletStatusStore();
const palletStatus = ref([] as PalletStatuses[]);

onMounted(async () => {
  await palletStatusStore.loadTestData();
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
  background-color: var(--cyan-100);
}

#app {
  display: block;
  padding: 0;
}
</style>
