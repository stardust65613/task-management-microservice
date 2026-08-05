import { defineStore } from "pinia";
import * as authService from "@/services/auth.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {

    async login(data) {
      const res = await authService.login(data);

      this.user = res.data.user;
      this.token = res.data.accessToken;

      localStorage.setItem(
        "accessToken",
        this.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(this.user)
      );
    },


    async register(data) {
      const res = await authService.register(data);

      return res.data;

    },


    async refreshToken() {
      const res = await authService.refreshToken();

      this.token = res.data.accessToken;

      localStorage.setItem(
        "accessToken",
        this.token
      );

    },


    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }
});