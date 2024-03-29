import type { PalletStatuses } from "../types/palletStatus";

export default class PalletStatusService {
  static async getAllData(): Promise<PalletStatuses[]> {
    const apiUrl = import.meta.env.VITE_ALL_PALLET_STATUS;
    return await PalletStatusService.fetchData(apiUrl);
  }

  static async getDataBySearchTerm(searchTerm: string): Promise<PalletStatuses[]> {
    const apiUrl = `${import.meta.env.VITE_PALLET_SEARCH}?SearchTerm=${searchTerm.trim()}`;
    return await PalletStatusService.fetchData(apiUrl);
  }

  static async getDataByPalletState(palletStatus: string): Promise<PalletStatuses[]> {
    const apiUrl = `${import.meta.env.VITE_PALLET_FILTER}${palletStatus.trim()}`;
    return await PalletStatusService.fetchData(apiUrl);
  }

  private static async fetchData(apiUrl: string): Promise<PalletStatuses[]> {
    const baseApiUrl = import.meta.env.VITE_DATABASE_HOST;

    try {
      const response = await fetch(`${baseApiUrl}${apiUrl}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
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
