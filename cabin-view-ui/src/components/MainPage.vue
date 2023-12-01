<template>
  <div class="main-container">
    <img :src="props.cameraFeedUrl" alt="Camera Feed" class="camera-feed" />
    <Button class="table-button">
      <PalletIcon />
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import PalletIcon from "@/icons/PalletIcon.vue.js";
const props = defineProps({
  cameraFeedUrl: String,
});
</script>

<style scoped lang="scss">
.camera-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.table-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
