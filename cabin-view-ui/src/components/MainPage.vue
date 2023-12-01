<template>
  <div class="main-container">
    <img :src="props.cameraFeedUrl" alt="Camera Feed" class="camera-feed" />
    <Button
      class="table-button"
      text
      raised
      rounded
      @click="$router.push('/tables')"
    >
      <template #icon> <PalletIcon class="pallet-icon" /> </template>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import PalletIcon from "@/icons/PalletIcon.vue";
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
  top: 2%;
  right: 2%;
  width: 3rem;
  height: 3rem;
}

.pallet-icon {
  padding-top: 0.5rem;
  width: 3rem;
  height: 3rem;
  color: white;
}
</style>
