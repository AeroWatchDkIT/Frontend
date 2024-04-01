import { defineStore } from "pinia";
import { UserService } from "@/services";
import type { User } from "@/types";

interface UserState {
  user: User[]
  userAuth: string
  forgetPassword: string
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: [],
    userAuth: '',
    forgetPassword: '',
  }),

  actions: {
    async login(userId:string, passcode:string, requestFromAdmin:boolean):Promise<string> {
      const data = await UserService.getUserAuth(userId, passcode, requestFromAdmin);
      this.userAuth = data;
      return this.userAuth;
    },
    async updatePassword(userId:string, newPass:string):Promise<string> {
      const data = await UserService.forgetPassword(userId, newPass);
      this.forgetPassword = data;
      return this.forgetPassword;
    }

  },
});
