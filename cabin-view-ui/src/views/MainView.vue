<template>
  <div class="main-container">
    <MainPage v-if="cameraOn" :camera-feed-url="cameraFeedUrl" />
    <RebootPage v-else />
  </div>
</template>

<script setup lang="ts">
import RebootPage from "@/components/RebootPage.vue";
import MainPage from "@/components/MainPage.vue";
import { ref, onMounted } from "vue";
const cameraOn = ref(true);
const cameraFeedUrl = ref("test");

onMounted(() => {
  runMainPage();
});

function runMainPage(): void {
  //loop every 3 seconds to check if camera is on
  //if(camera is on){cameraOn.value = true}
}
</script>

<style scoped lang="scss"></style>
