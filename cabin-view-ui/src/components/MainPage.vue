<template>
  <div class="main-container">
    <img :src="props.cameraFeedUrl" alt="Camera Feed" class="camera-feed" />
    <div class="info-display">
      <div
        class="info-part pallet"
        :class="{
          'tag-match': pallet.matching,
          'tag-mismatch': !pallet.matching && place.text,
          'no-tags': !pallet.text,
        }"
      >
        <h3 v-if="pallet.matching">Tags Matching</h3>
        <h3 v-else-if="!pallet.text">Pallet Tag</h3>
        <h3 v-else-if="place.text && !pallet.matching">
          Pallet and Shelf Mismatch
        </h3>
        <p>{{ pallet.text }}</p>
        <small>Recognized at: {{ pallet.time }}</small>
      </div>

      <div
        class="info-part shelf-tag"
        :class="{
          'tag-match': place.matching,
          'tag-mismatch': !place.matching && pallet.text,
          'no-tags': !place.text,
        }"
      >
        <h3 v-if="place.matching">Tags Matching</h3>
        <h3 v-else-if="!place.text">Shelf Tag</h3>
        <h3 v-else-if="pallet.text && !place.matching">
          Pallet and Shelf Mismatch
        </h3>
        <p>{{ place.text }}</p>
        <small>Recognized at: {{ place.time }}</small>
      </div>
    </div>

    <div class="leftside-buttons">
      <Button
        class="alert-button"
        icon="pi pi-sign-out"
        text
        raised
        rounded
        @click="logout"
      >
      </Button>
    </div>
    <div class="buttons">
      <Button
        class="table-button"
        text
        raised
        rounded
        @click="$router.push('/tables')"
      >
        <template #icon> <PalletIcon class="pallet-icon" /> </template>
      </Button>
      <Button
        class="alert-button"
        text
        raised
        rounded
        @click="showMissingPalletDialog"
      >
        <template #icon>
          <PlainAlertIcon class="alert-icon" />
        </template>
      </Button>
    </div>
    <DynamicDialog
      class="alertTest"
      :pt="{
        content: {
          style: {
            'border-top-left-radius': '2rem',
            'border-top-right-radius': '2rem',
            'border-bottom-right-radius': '2rem',
            'border-bottom-left-radius': '2rem',
          },
        },
      }"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import PalletIcon from "@/icons/PalletIcon.vue";
import PlainAlertIcon from "@/icons/PlainAlertIcon.vue";
import DynamicDialog from "primevue/dynamicdialog";
import MissingPallet from "./MissingPallet.vue";

import AlertModal from "./AlertModal.vue";
import { useDialog } from "primevue/usedialog";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  cameraFeedUrl: String,
  recognizedText: String,
  recognitionTime: String,
});

const dialog = useDialog();
const router = useRouter();
const pallet = ref({ text: "", time: "", updated: false, matching: false });
const place = ref({ text: "", time: "", updated: false, matching: false });
const isDialogOpen = ref(false);

function updateTagData(tagType: string, text: string) {
  const time = new Date().toLocaleTimeString();
  if (tagType === "pallet") {
    pallet.value = { text, time, updated: true, matching: false };
    setTimeout(() => {
      pallet.value.updated = false;
    }, 2000);
  } else if (tagType === "place") {
    place.value = { text, time, updated: true, matching: false };
    setTimeout(() => {
      place.value.updated = false;
    }, 2000);
  }
  checkForMatch();
}

function checkForMatch() {
  const palletCode = pallet.value.text.substring(2);
  const placeCode = place.value.text.substring(2);

  if (palletCode === placeCode && palletCode !== "") {
    pallet.value.matching = true;
    place.value.matching = true;
  } else {
    pallet.value.matching = false;
    place.value.matching = false;
  }
}

watch(
  () => props.recognizedText,
  (newValue) => {
    if (!newValue) {
      pallet.value = { text: "", time: "", updated: false, matching: false };
      place.value = { text: "", time: "", updated: false, matching: false };
      return;
    }

    if (newValue.startsWith("P-")) {
      if (
        place.value.text &&
        compareIgnoringFirstTwo(newValue, place.value.text)
      ) {
        showAlertDialog();
      }
      updateTagData("pallet", newValue);
      if (place.value.text) {
        checkForMatch();
      }
    } else if (newValue.startsWith("S-")) {
      if (
        pallet.value.text &&
        compareIgnoringFirstTwo(pallet.value.text, newValue)
      ) {
        showAlertDialog();
      }
      updateTagData("place", newValue);
      if (pallet.value.text) {
        checkForMatch();
      }
    }
  },
);

function compareIgnoringFirstTwo(str1: string, str2: string): boolean {
  return str1?.substring(2) !== str2?.substring(2);
}

function showAlertDialog(): void {
  if (!isDialogOpen.value) {
    isDialogOpen.value = true;
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
        pallet: pallet.value.text,
        place: place.value.text,
      },
      onClose: () => {
        isDialogOpen.value = false;
      },
    });
  }
}

function showMissingPalletDialog(): void {
  if (!isDialogOpen.value) {
    isDialogOpen.value = true;
    dialog.open(MissingPallet, {
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
        header: "Alert Missing Pallet",
      },
      onClose: () => {
        isDialogOpen.value = false;
      },
    });
  }
}

function logout(): void {
  sessionStorage.setItem("loggedIn", "false");
  router.push("/login");
}
</script>

<style scoped lang="scss">
.main-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.camera-feed {
  width: 100%;
  height: 100%;
}

.info-part p {
  margin: 0;
  padding: 0;
  font-weight: bold;
}

.info-part small {
  display: block;
  font-size: 0.75em;
  color: #666;
  margin-top: 5px;
}
.info-display {
  position: absolute;
  top: 53%;
  right: 10px;
  transform: translateY(-50%);
  width: 18%;
  height: auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  z-index: 100;
}
.info-part {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
}

.tag-match {
  border-color: #4caf50;
  background-color: #e6f9e6;
}

.tag-mismatch {
  border-color: #ff6f61;
  background-color: #ffcccc;
}

.no-tags {
  border-color: #ccc;
  background-color: rgba(255, 255, 255, 0.8);
}

@keyframes flashMatch {
  0%,
  100% {
    background-color: #e6f9e6;
  }
  50% {
    background-color: #c2f0c2;
  }
}

h3 {
  color: #333;
}
.leftside-buttons {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 2%;
  left: 2%;
}

.buttons {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 2%;
  right: 2%;
}

.table-button {
  width: 5rem;
  height: 5rem;
  margin-bottom: 1rem;
  background-color: white;
}

.alert-button {
  width: 5rem;
  height: 5rem;
  margin-bottom: 1rem;
  background-color: white;
}

.pallet-icon {
  padding-top: 0.5rem;
  width: 5rem;
  height: 5rem;
  color: white;
}

.alert-icon {
  width: 3rem;
  height: 3rem;
  color: white;
}

.alertTest {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 5rem;
  height: 5rem;
}

.alert-button {
  :deep(.pi) {
    font-size: 2rem;
    color: black;
  }
}
</style>
