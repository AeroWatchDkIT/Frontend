import type { PalletStatuses } from "../types/palletStatus";
import testData from './testData.json';

export default class PalletStatusService {
  static async getData(): Promise<PalletStatuses[]> {
      return testData.PalletStatuses;
  }
}

export const userService = new PalletStatusService();
