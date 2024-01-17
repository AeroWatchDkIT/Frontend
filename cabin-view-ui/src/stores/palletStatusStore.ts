import { defineStore } from "pinia";
import { PalletStatusService } from "@/services";
import type { PalletStatuses } from "@/types";

interface PalletStatusState {
  palletStatus: PalletStatuses[]
}

export const usePalletStatusStore = defineStore("palletStatus", {
  state: (): PalletStatusState => ({
    palletStatus: [],
  }),

  actions: {
    async loadTestData():Promise<void> {
      const data = await PalletStatusService.getData();
      this.palletStatus = data;
      console.log("palletStatus", this.palletStatus);
    },

  },
});
