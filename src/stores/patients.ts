import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import { useRouter } from "vue-router";

export const usePatientsStore = defineStore("patients", () => {
  /* Router Config */
  const { push } = useRouter();

  const ListData = ref([]);
  const itemData = ref(null);
  const patientSessions = ref([]);

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
    ListData.value = [];
    params.value = {
      page: 1,
      take: 10,
      totalPages: 0,
      totalElements: 0,
      filter: "",
      sort: "",
    };
  }

  async function fetchList() {
    try {
      const { data } = await ApiService.query("patients", {
        params: {
          page: params.value.page,
          limit: params.value.take,
          ...(params.value.filter && { name: params.value.filter }),
        },
      });

      ListData.value = data.data.results;
      params.value.totalPages = data.metadata.totalPages;
      params.value.totalElements = data.metadata.totalElements;
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
        `patients/${id}`,
        {}
      );
      itemData.value = responseData.data.patient;
    } catch (error) {
      console.error(error);
    }
  }

  async function create(payload: any) {
    try {
      const response = await ApiService.post("patients", payload);
      Swal.fire({
        text: "تم إنشاء المستخدم بنجاح ",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok",
        heightAuto: false,
        customClass: { confirmButton: "btn fw-semobold btn-light-primary" },
      });

      push(`/patients-view/${response.data.data.patient._id}`);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function update(payload: any): Promise<any> {
    try {
      const response = await ApiService.update(
        `patients/${payload._id}`,
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
      push(`/patients-view/${response.data.data.patient._id}`);
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
      return await ApiService.delete(`patients/${id}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async function getPatientSessions(id: any) {
    try {
      const { data } = await ApiService.query(`patients/${id}/sessions`, {});
      patientSessions.value = data.data.sessions;
      return data.data.sessions;
    } catch (error) {
      console.error(error);
    }
  }

  // Return the properties and functions to be used in the component
  return {
    /* List Table */
    ListData,
    params,
    patientSessions,
    /* View Item */
    itemData,

    /* Func */
    fetchList,
    resetItems,

    fetchItem,

    create,
    update,
    resetItemData,
    deleteItem,
    getPatientSessions,
  };
});
