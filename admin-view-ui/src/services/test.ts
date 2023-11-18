import type { Test } from '../types/test';

export default class UserService {

    static async getTest(): Promise<string> {
        return 'Hello World';
    };
    async getUser(): Promise<Test> {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const user = await response.json();
        return user;
    };
}

export const userService = new UserService();
