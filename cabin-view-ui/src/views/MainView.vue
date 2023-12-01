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
const cameraFeedUrl = ref("http://192.168.1.11:5000/video_feed");
const cameraStatus = ref();

onMounted(() => {
  //runMainPage();
});

function runMainPage(): void {
  setInterval(async () => {
    const response = await fetch(cameraFeedUrl.value);
    const data = await response.json();
    cameraStatus.value = data.status;
    if (cameraStatus.value !== "on") {
      console.log("someProperty is true");
      cameraOn.value = true;
      return;
    }
  }, 3000);
}
</script>

<style scoped lang="scss"></style>
