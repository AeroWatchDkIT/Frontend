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
const cameraFeedUrl = ref("http://192.168.16.126:5001/video_feed");
const cameraStatus = ref();
const recognizedText = ref("");
const recognitionTime = ref("");
const fetchInterval = ref<number | null>(null);

onMounted(async () => {
  checkCameraStatus();
  fetchRecognizedText(); // Initial fetch
  fetchInterval.value = setInterval(fetchRecognizedText, 5000); // Fetch every 5 seconds
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
      recognitionTime.value = data.detection_time; // Update time
      console.log("Fetched text:", data.detected_text); // Log the fetched text
      console.log("Detection time:", data.detection_time); // Log the detection time
    } else {
      console.error("Error fetching recognized text");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

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
