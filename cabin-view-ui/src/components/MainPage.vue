<template>
  <div class="main-container">
    <img :src="props.cameraFeedUrl" alt="Camera Feed" class="camera-feed" />
    <div style="color: green">
      Recognized Text: {{ props.recognizedText }} at {{ props.recognitionTime }}
    </div>
    <Button
      class="table-button"
      text
      raised
      rounded
      @click="$router.push('/tables')"
    >
      <template #icon> <PalletIcon class="pallet-icon" /> </template>
    </Button>
    <Button label="Alert" @click="showAlertDialog"></Button>
    <input v-model="pallet" placeholder="Type something..." />
    <input v-model="place" placeholder="Type something else..." />
    <DynamicDialog />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import PalletIcon from "@/icons/PalletIcon.vue";
import DynamicDialog from "primevue/dynamicdialog";
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
.camera-feed {
  width: 100%;
  max-height: 100vh;
  min-width: 100vw;
  object-fit: cover;
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
</style>
