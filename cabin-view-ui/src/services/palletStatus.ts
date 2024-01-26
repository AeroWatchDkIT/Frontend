import type { PalletStatuses } from "../types/palletStatus";

export default class PalletStatusService {
  static async getAllData(): Promise<PalletStatuses[]> {
    const apiUrl = 'https://localhost:7128/PalletStatuses';
    return await PalletStatusService.fetchData(apiUrl);
  }

  static async getDataBySearchTerm(searchTerm: string): Promise<PalletStatuses[]> {
    const apiUrl = `https://localhost:7128/PalletStatuses/search?SearchTerm=${searchTerm.trim()}`;
    return await PalletStatusService.fetchData(apiUrl);
  }

  static async getDataByPalletStatus(palletStatus: string): Promise<PalletStatuses[]> {
    const apiUrl = `https://localhost:7128/PalletStatuses?filterTerm=${palletStatus.trim()}`;
    return await PalletStatusService.fetchData(apiUrl);
  }

  private static async fetchData(apiUrl: string): Promise<PalletStatuses[]> {
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorMessage = `Failed to fetch data from ${apiUrl}. Status: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.entities;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}

export const userService = new PalletStatusService();
