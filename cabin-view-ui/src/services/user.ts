import type { User } from "../types/user";

export default class UserService {
    static async getUserAuth(userId: string, passcode: string, requestFromAdmin:boolean): Promise<string> {
        console.log('userId', userId);
        console.log('passcode', passcode);
        console.log('requestFromAdmin', requestFromAdmin);
        const apiUrl = `${import.meta.env.VITE_USER_AUTH}?userId=${userId.trim()}&passCode=${passcode.trim()}&requestFromAdmin=${requestFromAdmin}`;
        console.log('apiUrl', apiUrl)
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                return 'user found';
            } else {
                return 'Invalid user id and password combination';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}

export const userService = new UserService();