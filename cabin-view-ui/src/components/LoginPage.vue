<template>
  <div class="login-container">
    <div class="logo-container">
      <!-- Company logo at the top, centered -->
      <img
        src="@/assets/Palletsynclogo.png"
        alt="PalletSync Logo"
        class="company-logo"
      />
    </div>
    <div class="login-content">
      <div class="login-form">
        <form @submit.prevent="login">
          <FloatLabel class="userId">
            <InputText id="userId" v-model="userId" class="userId-inputtext" />
            <label for="userId">UserID</label>
          </FloatLabel>
          <FloatLabel class="password">
            <Password
              v-model="password"
              toggle-mask
              :feedback="false"
              class="password-inputtext"
            />
            <label for="password">Password</label>
          </FloatLabel>
          <div class="checkbox">
            <Checkbox v-model="requestLogin" :binary="true" />
            <label for="checkbox" class="checkbox-label"> Administrator </label>
          </div>
          <Button type="submit" class="submit-button">Sign In</Button>
          <Button
            text
            class="forget-button"
            @click="$router.push('/forget-password')"
            >Forgot your password?</Button
          >
        </form>
      </div>
      <div class="face-recognition">
        <div class="face-recognition-content">
          <img
            :src="faceRecognvideoFeedUrl"
            alt="Face Recognition Feed"
            class="face-recognition-feed"
          />
          <Button class="submit-button face" @click="handleFaceRecognition"
            >Face Recognition</Button
          >
        </div>
      </div>
    </div>
  </div>
  <Toast position="top-center" />
</template>

<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Password from "primevue/password";
import Checkbox from "primevue/checkbox";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/stores";
import { useRouter } from "vue-router";
import { time } from "console";

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();
const userId = ref("");
const password = ref("");
const requestLogin = ref(false);
const loginString = ref("");
const faceRecognvideoFeedUrl = ref("http://127.0.0.1:5000/video_feed");
//const faceRecognvideoFeedUrl = ref('http://192.168.167.168:5000/video_feed');

const isProcessing = ref(false);
const fetchInterval = ref<NodeJS.Timeout | null>(null);
const recognizedUser = ref("");

onMounted(async () => {
  await fetchRecognizedText();
  fetchInterval.value = setInterval(fetchRecognizedText, 5000);
  sessionStorage.setItem("loggedIn", "true");
});

onUnmounted(() => {
  if (fetchInterval.value) {
    clearInterval(fetchInterval.value);
  }
});

const handleFaceRecognition = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;

  try {
    await fetch("http://127.0.0.1:5000/trigger_face_recognition", {
      //await fetch("http://192.168.167.168:5000/trigger_face_recognition", {
      method: "POST",
    });
    console.log("Face recognition triggered");
    isProcessing.value = false;
  } catch (error) {
    console.error("Error triggering face recognition:", error);
    toast.add({
      severity: "error",
      summary: "Face Recognition Trigger Failed",
      detail: "Error triggering face recognition",
      life: 3000,
    });
  }
};

async function fetchRecognizedText(): Promise<void> {
  try {
    const response = await fetch("http://127.0.0.1:5000/get_access_status");
    //const response = await fetch("http://192.168.167.168:5000/get_access_status");

    console.log("Response:", response);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      console.log("Fetched text:", data.access_granted);
      if (data.access_granted == true) {
        sessionStorage.setItem("loggedIn", "true");
        await stopFaceRecognition(); // Stop the face recognition process
        toast.add({
          severity: "success",
          summary: "Access Granted",
          detail: "You have been granted access",
          life: 4000,
        });
        setTimeout(() => {
          router.push("/main");
        }, 3000);
      } else if (data.access_granted == false) {
        // toast.add({
        //   severity: "error",
        //   summary: "Access Denied",
        //   detail: "You have been denied access",
        //   life: 4000,
        // });
      }
    } else {
      console.error("Error fetching recognized text bbbbb");
    }
  } catch (error) {
    console.error("Error aaaaa:", error);
  }
}

const stopFaceRecognition = async () => {
  try {
    await fetch("http://127.0.0.1:5000/stop_face_recognition", {
      method: "POST",
    });
    console.log("Face recognition stopped");
  } catch (error) {
    console.error("Error stopping face recognition:", error);
    toast.add({
      severity: "error",
      summary: "Face Recognition Stop Failed",
      detail: "Error stopping face recognition",
      life: 3000,
    });
  }
};

async function login(): Promise<void> {
  loginString.value = await userStore.login(
    userId.value,
    password.value,
    requestLogin.value,
  );
  if (loginString.value === "user found") {
    sessionStorage.setItem("loggedIn", "true");
    router.push("/main");
  } else {
    toast.add({
      severity: "error",
      summary: "Login Failed",
      detail: "Invalid user id and password combination",
      life: 3000,
    });
  }
}
</script>

<style scoped lang="scss">
.logo-container {
  display: flex;
  justify-content: center; // Center the logo horizontally
  width: 800px; // Adjust to match the width of the two divs
}

.company-logo {
  max-width: 100%; // Adjusts the size of the logo
  height: auto; // Maintains aspect ratio
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  overflow: hidden; // Ensures any overflow is clipped
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--cyan-100);
}

.login-content {
  display: flex;
  flex-direction: row;
}

.login-form {
  background-color: #fff;
  padding: 2rem;
  padding-top: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  width: 400px; // Adjust as needed to avoid stretching
  min-height: 40vh;
  height: auto;
  max-width: 100%;
}
.face-recognition {
  background-color: #fff;
  padding: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 4rem;
  border-bottom-right-radius: 0.5rem;
  border-left: 1px solid #d3d3d3;
  width: 400px; // Adjust as needed to avoid stretching
  min-height: 40vh;
  height: auto;
  max-width: 100%;
}

.face-recognition-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.face-recognition img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  object-fit: contain;
}

.name {
  text-align: center;
}

.userId {
  margin-bottom: 2rem;
}

.userId-inputtext {
  width: 20rem;
}

.password {
  margin-bottom: 1rem;
}

.password-inputtext {
  :deep(.p-inputtext) {
    width: 20rem;
  }
}

.submit-button {
  width: 20rem;
  margin-bottom: 0rem;
  display: block;
}

.forget-button {
  width: 20rem;
  display: block;
  font-size: small;
  padding: 0.5rem;
}

.face-recognition-feed {
  margin-top: 0.5rem;
}

.checkbox {
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
}

.checkbox-label {
  font-size: small;
  align-self: center;
  margin-left: 0.5rem;
}
</style>
