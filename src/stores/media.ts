import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useMediaStore = defineStore("media", {
  actions: {
    async fileUpload(payload: any) {
      try {
        const formData = new FormData();
        formData.append("file", payload);
        const response = await ApiService.post("file/upload", formData);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});
