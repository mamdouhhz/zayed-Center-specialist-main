import { defineStore } from "pinia";
import { ref } from "vue";
import ApiService from "@/core/services/ApiService";
import { reinitializeComponents } from "@/core/plugins/keenthemes";

export const useLangStore = defineStore("lang", () => {
  /* Router Config */

const Languages = ref<any[]>([]);

async function fetchList() {
    try {
        const response = await ApiService.get("serverConfig/languages");
        Languages.value = response.data;
        reinitializeComponents();
    } catch (error) {
        console.error(error);
    }
}

  // Return the properties and functions to be used in the component
  return {
    /* List Table */
    Languages,


    /* Func */
    fetchList,

  };
});
