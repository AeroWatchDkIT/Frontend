<template>
  <div class="main-container">
    <MainPage v-if="cameraOn" />
    <RebootPage v-else />
  </div>
</template>

<script setup lang="ts">
import RebootPage from "@/components/RebootPage.vue";
import MainPage from "@/components/MainPage.vue";
import { ref } from "vue";
const cameraOn = ref(true);

function runMainPage(): void {
  //loop every 3 seconds to check if camera is on
  //if(camera is on){cameraOn.value = true}
}
</script>

<style scoped lang="scss"></style>
