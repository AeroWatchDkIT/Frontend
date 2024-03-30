<template>
  <div class="main-container">
    <div v-if="loggedIn" class="main">
      <MainPage
        v-if="cameraOn"
        :camera-feed-url="cameraFeedUrl"
        :recognition-time="recognitionTime"
        :recognized-text="recognizedText"
      />
      <RebootPage v-else />
    </div>
    <LoginPage v-else :logged-in="loggedIn" :emit-update="updateLoggedIn" />
  </div>
</template>

<script setup lang="ts">
import RebootPage from "@/components/RebootPage.vue";
import MainPage from "@/components/MainPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import { ref, onMounted, onUnmounted } from "vue";

const cameraOn = ref(true);
const loggedIn = ref(false);
const cameraFeedUrl = ref(import.meta.env.VITE_CAMERA_HOST);
const recognizedText = ref("");
const recognitionTime = ref("");
const fetchInterval = ref<NodeJS.Timeout | null>(null);

onMounted(async () => {
  const storedLoggedIn = localStorage.getItem("loggedIn");
  if (storedLoggedIn === "true") {
    loggedIn.value = true;
  }
  await fetchRecognizedText();
  await fetchCameraFeedUrl();
  fetchInterval.value = setInterval(fetchCameraFeedUrl, 5000);
  fetchInterval.value = setInterval(fetchRecognizedText, 5000);
});

onUnmounted(() => {
  if (fetchInterval.value) {
    clearInterval(fetchInterval.value);
  }
});

async function fetchCameraFeedUrl(): Promise<void> {
  try {
    const response = await fetch(import.meta.env.VITE_CAMERA_HOST_API);
    if (response.ok) {
      const data = await response.json();
      cameraFeedUrl.value = data.cameraFeedUrl;
      console.log("Fetched camera feed URL:", data.cameraFeedUrl);
    } else {
      console.error("Error fetching camera feed URL");
    }
  } catch (error) {
    console.error("Error fetching camera feed URL:", error);
  }
}

async function fetchRecognizedText(): Promise<void> {
  try {
    const response = await fetch(import.meta.env.VITE_DETECTED_CODE);
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

function updateLoggedIn(value: boolean): void {
  loggedIn.value = value;
  localStorage.setItem("loggedIn", value ? "true" : "false");
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
