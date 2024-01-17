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
      Placing Pallet "{{ pallet }}" on shelf "{{ place }}"
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
const place = dialogRef?.value.data.place;

function closeDialog(): void {
  dialogRef?.value.close();
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

.alert-icon {
  padding: 0rem;
}

.warning-text {
  text-align: center;
}
</style>
