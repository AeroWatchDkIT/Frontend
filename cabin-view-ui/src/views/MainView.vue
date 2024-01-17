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

const cameraOn = ref(false);
const cameraFeedUrl = ref("http://192.168.1.11:5000/video_feed");
const cameraStatus = ref();

onMounted(async () => {
  checkCameraStatus();
});

function checkCameraStatus(): void {
  // Simulating the case where camera status is "on"
  cameraOn.value = true;

  // Uncomment the following lines when actual fetching is implemented
  /*
    fetch(cameraFeedUrl.value)
      .then(response => response.json())
      .then(data => {
        cameraStatus.value = data.status;
        if (cameraStatus.value !== "on") {
          console.log("someProperty is true");
          cameraOn.value = true;
        }
      })
      .catch(error => {
        console.error("Error fetching camera status:", error);
      });
    */
}
</script>

<style scoped lang="scss"></style>
