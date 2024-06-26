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
    async loadData():Promise<void> {
      const data = await PalletStatusService.getAllData();
      this.palletStatus = data;
    },
    async searchPallet(searchTerm: string): Promise<void> {
      const data = await PalletStatusService.getDataBySearchTerm(searchTerm);
      this.palletStatus = data;
    },
    async loadDataByPalletState(palletState: string): Promise<void> {
      const data = await PalletStatusService.getDataByPalletState(palletState);
      this.palletStatus = data;
    }

  },
});
