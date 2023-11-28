<template>
  <div class="main-container">
    <img :src="props.cameraFeedUrl" alt="Camera Feed" class="camera-feed" />
  </div>
</template>

<script setup lang="ts">
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
</style>
