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
const cameraFeedUrl = ref(import.meta.env.VITE_CAMERA_HOST);
const recognizedText = ref("");
const recognitionTime = ref("");
const fetchInterval = ref<NodeJS.Timeout | null>(null);

onMounted(async () => {
  await fetchRecognizedText();
  fetchInterval.value = setInterval(fetchRecognizedText, 5000);
});

onUnmounted(() => {
  if (fetchInterval.value) {
    clearInterval(fetchInterval.value);
  }
});

async function fetchRecognizedText(): Promise<void> {
  try {
    const response = await fetch(import.meta.env.VITE_DETECTED_CODE);
    if (response.ok) {
      const data = await response.json();
      recognizedText.value = data.detected_text;
      recognitionTime.value = data.detection_time;
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
