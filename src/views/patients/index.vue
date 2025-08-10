<template>
  <div class="card">
    <div class="card-body">
      <!-- Datatable component -->
      <Datatable
        :header="tableHeader"
        modelNameEng="patients"
        modelNameAr="مريض"
        :data="ListData"
        :items-per-page="params.take"
        :items-per-page-dropdown-enabled="false"
        @page-change="handlePageChange"
        :total="params.totalElements"
        :total-pages="params.totalPages"
        :currentPage="params.page"
        @on-search="handleSearch"
        :searchable="true"
        @on-page-size-change="onPageSizeChange"
        :isExportable="false"
        :isAdd="false"
        :sort="sortOptions"
        @on-sort="handleSort"
      >
        <!-- Slot for rendering the username column -->
        <template v-slot:serial="{ row: data }">
          <info-item-table class="badge" :data="data.serial" type="string" />
        </template>
        <template v-slot:name="{ row: data }">
          <info-item-table class="badge" :data="data.name" type="string" />
        </template>
        <!-- Slot for rendering the email column -->
        <template v-slot:age="{ row: data }">
          <info-item-table class="badge" :data="data.age" type="string" />
        </template>
        <template v-slot:degree="{ row: data }">
          <info-item-table class="badge" :data="data.degree" type="string" />
        </template>
        <!-- Slot for rendering the _id column -->
        <template v-slot:address="{ row: data }">
          <info-item-table class="badge" :data="data.address" type="string" />
        </template>
        <!-- Slot for rendering the role column -->
        <template v-slot:phone="{ row: data }">
          <info-item-table class="badge" :data="data.phone" type="string" />
        </template>
        <template v-slot:inClass="{ row: data }">
          <info-item-table class="badge" :data="data.inClass" type="boolean" />
        </template>

        <!-- Slot for rendering the actions column -->
        <template v-slot:actions="{ row: data, index }">
          <div class="me-0">
            <button
              class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
              :id="'dropdownButton-' + data._id"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              data-kt-menu-flip="top-end"
            >
              <i class="bi bi-three-dots fs-3"></i>
            </button>
            <div
              :id="'dropdownMenu-' + data._id"
              class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semobold py-4 w-100px fs-6"
              data-kt-menu="true"
            >
              <!-- Link to view user details -->
              <div class="menu-item px-3">
                <router-link
                  class="menu-link px-3"
                  :to="{ name: 'patients-view', params: { id: data._id } }"
                >
                  عرض
                </router-link>
              </div>
              <!-- Link to edit user details -->
              <div class="menu-item px-3">
                <router-link
                  class="menu-link px-3"
                  :to="{ name: 'notebook-list', params: { id: data._id } }"
                >
                  الكراسة
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

/* Locale Components */
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import InfoItemTable from "@/components/info-item-table.vue";

/* Providers */
import { tableHeader } from "@/providers/patients";

/* Store */
import { usePatientsStore } from "@/stores/patients";
import { storeToRefs } from "pinia";

const store = usePatientsStore();
const { ListData, params } = storeToRefs(store);

const sortOptions = ref([]);

// Function to handle delete action
const submitDelete = async (id) => {
  const confirmed = await Swal.fire({
    text: "هل أنت متأكد أنك تريد حذف هذا المستخدم",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "تأكيد",
    cancelButtonText: "الغاء",
  });

  if (confirmed.isConfirmed) {
    await store.deleteItem(id).then(() => {
      Swal.fire({
        text: "تم حذف المستخدم بنجاح",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "حسنا",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semobold btn-light-primary",
        },
      });
      store.fetchList();
    });
  }
};

// Function to handle page size change
const onPageSizeChange = (size) => {
  store.params.take = size;
  store.params.page = 1;
  store.fetchList();
};

// Function to handle page change
const handlePageChange = (page) => {
  store.params.page = page;
  store.fetchList();
};

// Function to handle search
const handleSearch = (filters) => {
  store.params.filter = filters;
  store.fetchList();
};
// Function to handle sort
const handleSort = (sort) => {
  store.params.sort = sort;
  store.fetchList();
};
// Fetch list on component mount
onMounted(() => {
  store.params.page = 1;
  store.params.take = 10;
  store.fetchList();
});

// Reset items on component unmount
onUnmounted(() => {
  store.resetItems();
});
</script>
