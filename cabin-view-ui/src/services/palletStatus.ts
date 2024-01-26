import type { PalletStatuses } from "../types/palletStatus";

export default class PalletStatusService {
  static async getData(): Promise<PalletStatuses[]> {
    const apiUrl = 'https://localhost:7128/PalletStatuses';

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
