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

const cameraOn = ref(true);
const cameraFeedUrl = ref("http://192.168.16.126:5001/video_feed");
const recognizedText = ref("");
const recognitionTime = ref("");
const fetchInterval = ref<number | null>(null);

onMounted(async () => {
  fetchRecognizedText();
  fetchInterval.value = setInterval(fetchRecognizedText, 5000);
});

onUnmounted(() => {
  if (fetchInterval.value) {
    clearInterval(fetchInterval.value);
  }
});

async function fetchRecognizedText(): Promise<void> {
  try {
    const response = await fetch(
      "http://192.168.16.126:5001/get_detected_text",
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
      console.error("Error fetching recognized text bbbbb");
    }
  } catch (error) {
    console.error("Error aaaaa:", error);
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
