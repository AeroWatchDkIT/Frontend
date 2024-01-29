<template>
  <div class="main-container">
    <img :src="props.cameraFeedUrl" alt="Camera Feed" class="camera-feed" />
    <Button
      class="table-button"
      text
      raised
      rounded
      @click="$router.push('/tables')"
    >
      <template #icon> <PalletIcon class="pallet-icon" /> </template>
    </Button>
    <div class="alertTest">
      <Button label="Alert" @click="showAlertDialog"></Button>
      <input v-model="pallet" placeholder="Type something..." />
      <input v-model="place" placeholder="Type something else..." />
    </div>
    <DynamicDialog />
    <CameraInfoToast
      :recognition-time="props.recognitionTime"
      :recognized-text="props.recognizedText"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import PalletIcon from "@/icons/PalletIcon.vue";
import DynamicDialog from "primevue/dynamicdialog";
import CameraInfoToast from "./CameraInfoToast.vue";
import AlertModal from "./AlertModal.vue";
import { useDialog } from "primevue/usedialog";
import { ref, watch } from "vue";
const props = defineProps({
  cameraFeedUrl: String,
  recognizedText: String,
  recognitionTime: String,
});
const dialog = useDialog();
const pallet = ref("ABC");
const place = ref("forklift");

watch(place, (newPlace, oldPlace) => {
  if (oldPlace === "forklift" && newPlace !== pallet.value) {
    showAlertDialog();
  }
});

function showAlertDialog(): void {
  dialog.open(AlertModal, {
    props: {
      style: {
        width: "30vw",
        borderRadius: "2rem",
      },
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
      modal: true,
      closable: false,
      showHeader: false,
    },
    data: {
      pallet: pallet.value,
      place: place.value,
    },
  });
}
</script>

<style scoped lang="scss">
.main-container {
  width: 100%;
  height: 100vh;
}
.camera-feed {
  width: 100%;
  height: 100%;
}

.table-button {
  position: absolute;
  top: 2%;
  right: 2%;
  width: 5rem;
  height: 5rem;
  background-color: var(--cyan-100);
}

.pallet-icon {
  padding-top: 0.5rem;
  width: 5rem;
  height: 5rem;
  color: white;
}

.alertTest {
  position: absolute;
  top: 5%;
  left: 0%;
  width: 5rem;
  height: 5rem;
  background-color: var(--cyan-100);
}
</style>
