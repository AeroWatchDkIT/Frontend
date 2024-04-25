import type { User } from "../types/user";

export default class UserService {
    static async getUserAuth(userId: string, passcode: string, requestFromAdmin:boolean): Promise<string> {
        const apiUrl = `${import.meta.env.VITE_USER_AUTH}?userId=${userId.trim()}&passCode=${passcode.trim()}&requestFromAdmin=${requestFromAdmin}`;
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

    static async forgetPassword(userId: string, newPass:string): Promise<string> {
        const apiUrl = `${import.meta.env.VITE_FORGET_PASSWORD}?id=${userId.trim()}&newPassword=${newPass.trim()}`;
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                return 'Password updated';
            } else {
                return 'Invalid user id';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}

export const userService = new UserService();