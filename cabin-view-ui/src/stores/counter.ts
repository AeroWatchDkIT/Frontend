import { defineStore } from "pinia";
import { UserService } from "@/services";

interface CounterState {
  count: number;
  message: string;
  isEnabled: boolean;
}

export const useCounterStore = defineStore("counter", {
  state: (): CounterState => ({
    count: 0,
    message: "Hello, Pinia!",
    isEnabled: true,
  }),

  actions: {
    async loadTestData() {
      const testMessage = await UserService.getTest();
      this.message = testMessage;
      console.log("testMessage", testMessage);
    },

    increment() {
      this.count++;
    },

    setMessage(newMessage: string) {
      this.message = newMessage;
    },

    toggleEnabled() {
      this.isEnabled = !this.isEnabled;
    },
  },
});
