<template>
  <div class="alert-container">
    <Dropdown
      v-model="selectedPallet"
      :options="palletStatus"
      filter
      option-label="name"
      placeholder="Select a Pallet"
      class="dropdown"
    >
    </Dropdown>
    <div class="buttons">
      <Button
        class="cancel-button"
        icon="pi pi-times"
        label="Cancel"
        outlined
        size="small"
        @click="cancel()"
      />
      <Button
        class="confirm-button"
        icon="pi pi-check"
        label="Alert"
        size="small"
        @click="alertMissingPallet()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { inject, ref, onMounted } from "vue";
import type { DialogPassThroughAttributes } from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import Dropdown from "primevue/dropdown";
import { usePalletStatusStore } from "@/stores/palletStatusStore";
import type { PalletStatuses } from "@/types/palletStatus";

const palletStatusStore = usePalletStatusStore();
const palletStatus = ref([] as PalletStatuses[]);
const dialogRef: DialogPassThroughAttributes | undefined = inject("dialogRef");
const toast = useToast();
const selectedPallet = ref();

onMounted(async () => {
  await palletStatusStore.loadData();
  palletStatus.value = palletStatusStore.palletStatus;
});

function cancel(): void {
  dialogRef?.value.close();
}

function alertMissingPallet(): void {
  if (!selectedPallet.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Please select a pallet",
      life: 3000,
    });
    return;
  } else {
    toast.add({
      severity: "info",
      summary: "Alert",
      detail: "Alert sent to other forklift drivers",
      life: 3000,
    });
    dialogRef?.value.close();
  }
}
</script>

<style scoped lang="scss">
.back-button {
  position: absolute;
  top: 2%;
  right: 2%;
  width: 3rem;
  height: 3rem;
}

.cancel-button {
  margin-right: 0.5rem;
}

.alert-icon {
  padding: 0rem;
}

.warning-text {
  margin: 0rem;
  text-align: center;
  font-weight: 400;
}

.buttons {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top: 1rem;
}

i {
  font-size: 2rem;
  margin-right: 0.5rem;
}

.alert-container {
  :deep(.p-dropdown) {
    width: 100%;
  }
}
</style>
