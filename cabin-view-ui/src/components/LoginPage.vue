<template>
  <div class="login-container">
    <div class="logo-container">
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
        </div>
        <Button class="submit-button face" @click="handleFaceRecognition"
          >Face Recognition</Button
        >
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

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();
const userId = ref("");
const password = ref("");
const requestLogin = ref(false);
const loginString = ref("");
const faceRecognvideoFeedUrl = ref(import.meta.env.VITE_FACE_RECOGNITION_FEED);

const isProcessing = ref(false);
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

const handleFaceRecognition = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;

  try {
    await fetch(import.meta.env.VITE_TRIGGER_FACE_RECOGNITION, {
      method: "POST",
    });
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
    const response = await fetch(import.meta.env.VITE_ACCESS_STATUS);
    if (response.ok) {
      const data = await response.json();
      if (data.access_granted == true) {
        sessionStorage.setItem("loggedIn", "true");
        await stopFaceRecognition();
        toast.add({
          severity: "success",
          summary: "Access Granted",
          detail: "You have been granted access",
          life: 4000,
        });
        setTimeout(() => {
          router.push("/main");
        }, 3000);
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
    await fetch(import.meta.env.VITE_STOP_FACE_RECOGNITION, {
      method: "POST",
    });
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
  justify-content: center;
  width: 800px;
}

.company-logo {
  max-width: 100%;
  height: auto;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  overflow: hidden;
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
  width: 400px;
  min-height: 40vh;
  height: auto;
  max-width: 100%;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.face-recognition {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  padding: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 4rem;
  border-bottom-right-radius: 0.5rem;
  border-left: 1px solid #d3d3d3;
  width: 400px;
  min-height: 40vh;
  height: auto;
  max-width: 100%;
}

.face-recognition-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.face-recognition img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  object-fit: contain;
}

.face {
  align-self: flex-end;
  margin-top: auto;
}

.name {
  text-align: center;
}

.userId {
  margin-bottom: 2rem;
}

.userId-inputtext {
  width: 100%;
}

.password {
  margin-bottom: 1rem;
}

.password-inputtext {
  :deep(.p-inputtext) {
    width: 21rem;
  }
}

.submit-button {
  width: 100%;
  margin-bottom: 0rem;
  display: block;
}

.forget-button {
  width: 100%;
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
