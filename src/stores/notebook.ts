import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import { useRouter } from "vue-router";

export const useNotebooksStore = defineStore("notebooks", () => {
  /* Router Config */
  const { push } = useRouter();

  const patientNotebooks = ref([]);
  const itemData = ref(null);

  const params = ref({
    page: 1,
    take: 10,
    totalPages: 0,
    totalElements: 0,
    filter: "",
    sort: "",
  });

  /* Reset To Default Values */
  function resetItems() {
    patientNotebooks.value = [];
    params.value = {
      page: 1,
      take: 10,
      totalPages: 0,
      totalElements: 0,
      filter: "",
      sort: "",
    };
  }

  async function fetchList(id: any) {
    try {
      const { data } = await ApiService.query(`notebooks/patient/${id}`, {
        params: {
          ...(params.value.filter && { name: params.value.filter }),
        },
      });

      patientNotebooks.value = data.data.patientNotebooks;
      // params.value.totalPages = data.metadata.totalPages;
      // params.value.totalElements = data.metadata.totalElements;
      // params.value.page = page;
      // params.value.take = data.result;

      reinitializeComponents();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchItem(id: any) {
    try {
      const { data: responseData } = await ApiService.query(
        `notebooks/patient/${id}/notebook`,
        {}
      );
      itemData.value = responseData.data.notebook;
    } catch (error) {
      console.error(error);
    }
  }

  async function create(id: string, payload: any) {
    try {
      const response = await ApiService.post(
        `notebooks/patient/${id}`,
        payload
      );
      Swal.fire({
        text: "تم اضافة الكراسة بنجاح ",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok",
        heightAuto: false,
        customClass: { confirmButton: "btn fw-semobold btn-light-primary" },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function update(payload: any): Promise<any> {
    try {
      const response = await ApiService.update(
        `sessions/my-sessions/${payload._id}`,
        payload
      );
      Swal.fire({
        text: "تم تحديث المستخدم بنجاح",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: { confirmButton: "btn fw-semobold btn-light-primary" },
      });
      console.log("🚀 ~ update ~ response:", response);
      push(`/specialistSessions-view/${response.data.data.patient._id}`);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  function resetItemData() {
    itemData.value = null;
  }

  async function deleteItem(id: any) {
    try {
      return await ApiService.delete(`notebooks/${id}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // Return the properties and functions to be used in the component
  return {
    /* List Table */
    patientNotebooks,
    params,
    /* View Item */
    itemData,

    /* Func */
    fetchList,
    fetchItem,
    resetItems,
    resetItemData,
    create,
    update,
    deleteItem,
  };
});
