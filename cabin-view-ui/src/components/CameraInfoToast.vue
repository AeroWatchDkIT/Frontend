<template>
  <div class="card-container">
    <Toast position="top-center" group="bc" @close="onClose">
      <template #message="slotProps">
        <div class="toast-content">
          <div class="header">
            <i class="pi pi-info-circle icon"></i>
            <span class="header-text">Text Recognised</span>
          </div>
          <div class="detail">
            {{ slotProps.message.detail }}
          </div>
          <div class="summary">
            {{ slotProps.message.summary }}
          </div>
        </div>
      </template>
    </Toast>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { ref, watch } from "vue";

const props = defineProps({
  recognizedText: String,
  recognitionTime: String,
});

const toast = useToast();
const visible = ref(false);

watch(
  () => props.recognitionTime,
  (newValue) => {
    if (newValue) {
      showTemplate();
    }
  },
);

function showTemplate(): void {
  toast.add({
    severity: "info",
    summary: props.recognitionTime,
    detail: props.recognizedText,
    group: "bc",
    life: 5000,
  });
  visible.value = true;
}

const onClose = () => {
  visible.value = false;
};
</script>

<style scoped lang="scss">
.card-container {
  display: flex;
  justify-content: center;
}

.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.icon {
  font-size: 2rem;
}
.header-text {
  font-weight: bold;
  font-size: small;
  color: var(--text-color);
}

.summary {
  font-weight: 500;
  font-size: small;
  color: var(--text-color);
}

.detail {
  font-weight: 500;
  font-size: 1.25rem;
  margin-top: 0.75rem;
  color: var(--text-color);
}
</style>
