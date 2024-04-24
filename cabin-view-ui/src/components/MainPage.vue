<template>
  <div class="main-container">
    <img :src="props.cameraFeedUrl" alt="Camera Feed" class="camera-feed" />

    <!-- Split rectangles for displaying match information -->
    <!-- <div class="info-display">
      <h3>Pallet Tags</h3>
      <div class="info-part pallet" :class="{ match: pallet !== '' }">
        
        <p>{{ pallet }}</p>
      </div>
      <h3>Shelf Tags</h3>
      <div class="info-part shelf-tag" :class="{ match: place !== '' }">
        
        <p>{{ place }}</p>
      </div>
    </div> -->
    // The above code is replaced with the below code
    <!-- <div class="info-display">
      <div class="info-part pallet" :class="{ match: pallet.updated }">
        <h3>Pallet Tag</h3>
        <p>{{ pallet.text }}</p>
        <small>Recognized at: {{ pallet.time }}</small>
      </div>
      <div class="info-part shelf-tag" :class="{ match: place.updated }">
        <h3>Shelf Tag</h3>
        <p>{{ place.text }}</p>
        <small>Recognized at: {{ place.time }}</small>
      </div>
    </div> -->

    <div class="info-display">
      <div class="info-part pallet" :class="{ 'tag-match': pallet.matching, 'no-tags': !pallet.text }">
        <h3 v-if="pallet.matching">Tags Matching</h3>
        <h3 v-else>Pallet Tag</h3>
        <p>{{ pallet.text }}</p>
        <small>Recognized at: {{ pallet.time }}</small>
      </div>
      <div class="info-part shelf-tag" :class="{ 'tag-match': place.matching, 'no-tags': !place.text }">
        <h3 v-if="place.matching">Tags Matching</h3>
        <h3 v-else>Shelf Tag</h3>
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
    <CameraInfoToast
      :recognition-time="props.recognitionTime"
      :recognized-text="props.recognizedText"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import PalletIcon from "@/icons/PalletIcon.vue";
import PlainAlertIcon from "@/icons/PlainAlertIcon.vue";
import DynamicDialog from "primevue/dynamicdialog";
import CameraInfoToast from "./CameraInfoToast.vue";
import MissingPallet from "./MissingPallet.vue";
import AlertModal from "./AlertModal.vue";
import { useDialog } from "primevue/usedialog";
import { ref, watch, toRef } from "vue";s
import { useRouter } from "vue-router";

const props = defineProps({
  cameraFeedUrl: String,
  recognizedText: String,
  recognitionTime: String,
});

const dialog = useDialog();
const router = useRouter();
const data = toRef(props, "recognizedText");
//const pallet = ref({ text: "", time: "", updated: false });
//const place = ref({ text: "", time: "", updated: false });
const pallet = ref({ text: "", time: "", updated: false, matching: false });
const place = ref({ text: "", time: "", updated: false, matching: false });

function updateTagData(tagType, text) {
  const time = new Date().toLocaleTimeString();
  if (tagType === 'pallet') {
    pallet.value = { text, time, updated: true, matching: false }; // Ensure 'matching' is reset on each update
    setTimeout(() => { pallet.value.updated = false; }, 2000); // Clear updated status after delay
  } else if (tagType === 'place') {
    place.value = { text, time, updated: true, matching: false }; // Ensure 'matching' is reset on each update
    setTimeout(() => { place.value.updated = false; }, 2000); // Clear updated status after delay
  }
}

// Function to check if the tags match, ignoring the first two characters
// function checkForMatch() {
//   if (pallet.value.text && place.value.text && !compareIgnoringFirstTwo(pallet.value.text, place.value.text)) {
//     pallet.value.matching = true;
//     place.value.matching = true;
//     // Optionally, you could also show an alert dialog if they match
//     // showAlertDialog();
//   } else {
//     pallet.value.matching = false;
//     place.value.matching = false;
//   }
// }
function checkForMatch() {
  // Extract the codes by removing the first two characters
  const palletCode = pallet.value.text.substring(2);
  const placeCode = place.value.text.substring(2);

  // Check if codes match and update the matching flag accordingly
  if (palletCode === placeCode && palletCode !== "") {
    pallet.value.matching = true;
    place.value.matching = true;
  } else {
    pallet.value.matching = false;
    place.value.matching = false;
  }
}

//update the divs with the new values
watch(() => props.recognizedText, (newValue) => {
  if (!newValue) {
    // Reset both pallet and place data when there is no recognized text
    pallet.value = { text: "", time: "", updated: false, matching: false };
    place.value = { text: "", time: "", updated: false, matching: false };
    return;
  }

  if (newValue.startsWith("P-")) {
    if (place.value.text && compareIgnoringFirstTwo(newValue, place.value.text)) {
      showAlertDialog();
    }
    updateTagData('pallet', newValue);
    if (place.value.text) {
      checkForMatch();
    }
  } else if (newValue.startsWith("S-")) {
    if (pallet.value.text && compareIgnoringFirstTwo(pallet.value.text, newValue)) {
      showAlertDialog();
    }
    updateTagData('place', newValue);
    if (pallet.value.text) {
      checkForMatch();
    }
  }
});


function compareIgnoringFirstTwo(str1: string, str2: string): boolean {
  return str1?.substring(2) !== str2?.substring(2);
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

function showMissingPalletDialog(): void {
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
  });
}

function logout(): void {
  sessionStorage.setItem("loggedIn", "false");
  router.push("/login");
}
</script>

<style scoped lang="scss">
.main-container {
  position: relative; // Needed for absolute positioning of children
  width: 100%;
  height: 100vh;
  overflow: hidden; // Ensures no scroll bars appear
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
  position: absolute;  // Positioned absolutely relative to the main container
  top: 53%;            // Center vertically
  right: 10px;         // 10px from the right edge of the main container
  transform: translateY(-50%); // This will vertically center it at 'top: 50%'
  width: 18%;          // Adjust width as needed
  height: auto;        // Height will depend on content
  background-color: rgba(255, 255, 255, 0.8); // Semi-transparent background
  padding: 10px;
  border-radius: 5px; // Optional: rounded corners
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  z-index: 100;       // Make sure it's above the video feed
}
.info-part {
  border: 1px solid #ccc; /* Default border color */
  padding: 10px;
  margin-bottom: 10px;
}

.tag-match {
  border-color: #4CAF50; /* Green border to indicate a match */
  background-color: #e6f9e6; /* Light green background for visibility */
  animation: flashMatch 1s ease-out;
}

@keyframes flashMatch {
  0%, 100% {
    background-color: #e6f9e6;
  }
  50% {
    background-color: #c2f0c2;
  }
}
.no-tags {
  border-color: #ccc; /* Grey or neutral color indicating no tags detected */
}

// .info-part {
//   border: 1px solid #ccc;
//   margin-bottom: 10px;  // Space between pallet and shelf tag
//   padding: 10px;
//   transition: background-color 0.5s ease;
// }

// .match {
//   animation: pulseUpdate 0.5s ease-out;
//   border-color: #4CAF50; /* Green border to indicate update */
// }

// @keyframes pulseUpdate {
//   0%, 100% {
//     background-color: transparent;
//   }
//   50% {
//     background-color: #d4edda;
//   }
// }

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

<!--
  
 // watch(
//   data,
//   (oldPlace, newPlace) => {
//     if (
//       oldPlace?.charAt(0) === "S" &&
//       newPlace?.charAt(0) === "P" &&
//       compareIgnoringFirstTwo(newPlace, oldPlace)
//     ) {
//       place.value = oldPlace;
//       pallet.value = newPlace;
//       showAlertDialog();
//     }

//     if (
//       oldPlace?.charAt(0) === "P" &&
//       newPlace?.charAt(0) === "S" &&
//       compareIgnoringFirstTwo(newPlace, oldPlace)
//     ) {
//       pallet.value = oldPlace;
//       place.value = newPlace;
//       showAlertDialog();
//     }
//   },
//   { immediate: true },
// ); 
  
  
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

.info-display {
  width: 80%;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.info-part {
  border: 2px solid #ccc;
  padding: 10px;
  margin: 5px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5; /* Default light gray background */
}

.match {
  background-color: #4CAF50; /* Green background on match */
  border-color: #4CAF50; /* Optional: change border color on match */
}

h3 {
  margin-top: 0;
  color: #333;
}
</style> -->
