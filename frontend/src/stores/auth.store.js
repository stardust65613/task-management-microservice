import { defineStore } from "pinia";
import { useUserStore } from "./user.store";
import * as authService from "@/services/auth.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }),

  actions: {

    async login(data) {
      const res = await authService.login(data);

      this.user = res.data.data.user;
      this.accessToken = res.data.data.accessToken;
      this.refreshToken = res.data.data.refreshToken;

      localStorage.setItem(
        "accessToken",
        this.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        this.refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(this.user)
      );

      const userStore = useUserStore();
      await userStore.getMyInformation();
    },


    async register(data) {
      const res = await authService.register(data);

      return res.data;

    },


    async RefreshToken() {
      const res = await authService.refreshToken();

      this.token = res.data.accessToken;

      localStorage.setItem(
        "accessToken",
        this.accessToken
      );

    },


    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }
});