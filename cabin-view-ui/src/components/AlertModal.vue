<template>
  <div class="alert-container">
    <Button
      class="back-button"
      icon="pi pi-times"
      severity="danger"
      text
      rounded
      aria-label="Filter"
      @click="closeDialog()"
    />
    <AlertIcon class="alert-icon" />
    <h2 class="warning-text">
      Placing Pallet "{{ pallet }}" on shelf "{{ shelf }}"
    </h2>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { inject } from "vue";
import AlertIcon from "@/icons/AlertIcon.vue";
import type { DialogPassThroughAttributes } from "primevue/dialog";

const dialogRef: DialogPassThroughAttributes | undefined = inject("dialogRef");
const pallet = dialogRef?.value.data.pallet;
const shelf = dialogRef?.value.data.shelf;

function closeDialog(): void {
  dialogRef?.value.close();
}
</script>

<style scoped lang="scss">
:deep(.p-dialog .p-dialog-header) {
  display: none;
}

.back-button {
  position: absolute;
  top: 2%;
  right: 2%;
  width: 3rem;
  height: 3rem;
}

.alert-icon {
  padding: 0rem;
}

.warning-text {
  text-align: center;
}
</style>
