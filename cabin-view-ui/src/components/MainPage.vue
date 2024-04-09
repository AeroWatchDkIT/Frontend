<template>
  <div class="main-container">
    <img :src="props.cameraFeedUrl" alt="Camera Feed" class="camera-feed" />
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
    <CameraInfoToast
      :recognition-time="props.recognitionTime"
      :recognized-text="props.recognizedText"
    />
  </div>
  <ConfirmDialog></ConfirmDialog>
  <Toast position="top-center" />
</template>

<script setup lang="ts">
import Button from "primevue/button";
import PalletIcon from "@/icons/PalletIcon.vue";
import PlainAlertIcon from "@/icons/PlainAlertIcon.vue";
import DynamicDialog from "primevue/dynamicdialog";
import CameraInfoToast from "./CameraInfoToast.vue";
import AlertModal from "./AlertModal.vue";
import ConfirmDialog from "primevue/confirmdialog";
import { useDialog } from "primevue/usedialog";
import { useConfirm } from "primevue/useconfirm";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { ref, watch, toRef } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  cameraFeedUrl: String,
  recognizedText: String,
  recognitionTime: String,
});

const dialog = useDialog();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const data = toRef(props, "recognizedText");
const pallet = ref("");
const place = ref("");

watch(
  data,
  (oldPlace, newPlace) => {
    if (
      oldPlace?.charAt(0) === "S" &&
      newPlace?.charAt(0) === "P" &&
      compareIgnoringFirstTwo(newPlace, oldPlace)
    ) {
      place.value = oldPlace;
      pallet.value = newPlace;
      showAlertDialog();
    }

    if (
      oldPlace?.charAt(0) === "P" &&
      newPlace?.charAt(0) === "S" &&
      compareIgnoringFirstTwo(newPlace, oldPlace)
    ) {
      pallet.value = oldPlace;
      place.value = newPlace;
      showAlertDialog();
    }
  },
  { immediate: true },
);

function compareIgnoringFirstTwo(str1: string, str2: string): boolean {
  return str1?.substring(2) !== str2?.substring(2);
}

function showMissingPalletDialog(): void {
  confirm.require({
    message: "Alert the other forklift drivers?",
    header: "Alert Missing Pallet",
    icon: "pi pi-exclamation-triangle",
    rejectClass: "p-button-secondary p-button-outlined",
    rejectLabel: "Cancel",
    acceptLabel: "Alert",
    accept: () => {
      toast.add({
        severity: "info",
        summary: "Alert",
        detail: "Alert sent to other forklift drivers",
        life: 3000,
      });
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
}

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

function logout(): void {
  sessionStorage.setItem("loggedIn", "false");
  router.push("/login");
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
