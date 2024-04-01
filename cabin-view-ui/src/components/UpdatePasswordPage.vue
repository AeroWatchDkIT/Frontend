<template>
  <div class="login-container">
    <div class="login-form">
      <h1 class="name">Update Password</h1>
      <form @submit.prevent="forgetPassword">
        <FloatLabel class="userId">
          <InputText id="userId" v-model="userId" class="userId-inputtext" />
          <label for="userId">UserID</label>
        </FloatLabel>
        <FloatLabel class="password">
          <Password v-model="password" toggle-mask class="password-inputtext" />
          <label for="password">New Password</label>
        </FloatLabel>

        <Button type="submit" class="submit-button">Update Password</Button>
      </form>
      <Button
        type="submit"
        class="cancel submit-button"
        severity="danger"
        @click="cancel"
        >Cancel</Button
      >
    </div>
  </div>
  <Toast position="top-center" />
</template>

<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Password from "primevue/password";
import { ref } from "vue";
import { useUserStore } from "@/stores";
import { useRouter } from "vue-router";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();
const userId = ref("");
const password = ref("");
const loginString = ref("");

async function forgetPassword(): Promise<void> {
  loginString.value = await userStore.updatePassword(
    userId.value,
    password.value,
  );
  if (loginString.value === "Password updated") {
    toast.add({
      severity: "success",
      summary: "Password Updated",
      detail: "Your password has been successfully updated",
      life: 3000,
    });
    router.push("/login");
  } else {
    toast.add({
      severity: "error",
      summary: "Invalid User ID",
      detail: "Invalid user id or no user found with this id",
      life: 3000,
    });
  }
}

function cancel(): void {
  router.push("/login");
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
  margin-bottom: 2rem;
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

.cancel {
  margin-top: 1rem;
}
</style>
