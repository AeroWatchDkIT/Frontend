<template>
  <div class="login-container">
    <div class="login-form">
      <h1 class="name">Login</h1>
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
        <p class="or"><span>Or</span></p>
        <Button class="submit-button face">Face Recognition</Button>
      </form>
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
import { ref } from "vue";
import { useUserStore } from "@/stores";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();
const userId = ref("");
const password = ref("");
const requestLogin = ref(false);
const loginString = ref("");

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
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--cyan-100);
}
.login-form {
  background-color: #fff;
  padding: 2rem;
  padding-top: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
.face {
  margin-top: 2rem;
}
.forget-button {
  width: 20rem;
  display: block;
  font-size: small;
  padding: 0.5rem;
}
.or {
  text-align: center;
  border-bottom: 1px solid #000;
  line-height: 0.1em;
  width: 100%;
}

.or span {
  background: white;
  padding: 0 0.5rem;
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