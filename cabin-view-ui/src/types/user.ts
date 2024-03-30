export interface User {
    id: string;
    userType: number;
    firstName: string;
    lastName: string;
    passcode: string;
    forkliftCertified: boolean;
    incorrectPalletPlacements: number;
  }