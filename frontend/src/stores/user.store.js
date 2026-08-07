import { defineStore } from "pinia";
import * as userService from "@/services/user.service";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }),

  actions: {

    async getMyInformation(){
        const res = await userService.getMyInfo();

        console.log(res.data);

        this.user = res.data.data;

        localStorage.setItem(
          "user",
          JSON.stringify(this.user)
        );


        return res.data.data;
    },

    async editMyInformation(data){
        const res = await userService.editMyInfo(data);

        this.user = res.data.data;

        return res.data.data;
    },

    async editMyAvatar(data){
        const res = await userService.editMyAvatar(data);

        this.user = res.data.data;

        return res.data.data;
    },

    async deleteAccount(){
        const res = await userService.deleteAccount();

        this.user = null;

        return res.data.data;
    },

    async getUserInfo(userId){
        const res = await userService.getUserInfo(userId);

        return res.data.data;
    },

  }
});