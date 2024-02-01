<template>
  <div class="main-container">
    <MainPage
      v-if="cameraOn"
      :camera-feed-url="cameraFeedUrl"
      :recognition-time="recognitionTime"
      :recognized-text="recognizedText"
    />
    <RebootPage v-else />
  </div>
</template>

<script setup lang="ts">
import RebootPage from "@/components/RebootPage.vue";
import MainPage from "@/components/MainPage.vue";
import { ref, onMounted, onUnmounted } from "vue";

const cameraOn = ref(false);
const cameraFeedUrl = ref("");
const recognizedText = ref("");
const recognitionTime = ref("");
const fetchInterval = ref<number | null>(null);
const fetchCameraInterval = ref<number | null>(null);

onMounted(async () => {
  checkCameraStatus();
  fetchRecognizedText();
  fetchCameraInterval.value = setInterval(checkCameraStatus, 5000);
  fetchInterval.value = setInterval(fetchRecognizedText, 5000);
});

onUnmounted(() => {
  if (fetchInterval.value) {
    clearInterval(fetchInterval.value);
  }
  if (fetchCameraInterval.value) {
    clearInterval(fetchCameraInterval.value);
  }
});

async function fetchRecognizedText(): Promise<void> {
  try {
    const response = await fetch(
      "http://192.168.92.136:5001/get_detected_text",
    );
    console.log("Response:", response);
    if (response.ok) {
      const data = await response.json();
      recognizedText.value = data.detected_text;
      recognitionTime.value = data.detection_time;
      console.log(data);
      console.log("Fetched text:", data.detected_text);
      console.log("Detection time:", data.detection_time);
    } else {
      console.error("Error fetching recognized text");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function checkCameraStatus(): Promise<void> {
  try {
    const response = await fetch("http://192.168.92.136:5001/video_feed");
    if (response.ok) {
      cameraOn.value = true;
    } else {
      cameraOn.value = false;
    }
  } catch (error) {
    cameraOn.value = false;
  }
}
</script>

<style scoped lang="scss">
.testText {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
