<template>
  <section>
    <div id="kt_app_content_container" class="app-container container-fluid">
      <div class="card mb-5 mb-xl-10" id="kt_patients_details_view">
        <div class="card-header cursor-pointer">
          <div class="card-title m-0">
            <h3 class="fw-bold m-0">بيانات المريض</h3>
          </div>
          <div>
            <button @click="printData" class="btn btn-secondary mt-3">
              طباعة البيانات
            </button>
          </div>
        </div>

        <div class="p-9" id="DataView">
          <div class="row mb-7">
            <div v-if="viewData" class="row">
              <div class="col-12">
                <div class="row card-header" style="border: none">
                  <div class="mb-3">
                    <div class="image-preview">
                      <label for="imageInput">
                        <img
                          :src="
                            imageData ||
                            `http://localhost:3000/img/patients/${viewData.photo}`
                          "
                          alt="Image Preview"
                          v-if="imageData || viewData.photo !== 'default.jpg'"
                        />
                        <div v-else class="placeholder">لا يوجد صورة</div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row mt-7">
                  <!-- other info items -->
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="اسم المريض"
                      :data="viewData.name"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرقم التسلسلي"
                      :data="viewData.serial"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="العمر"
                      :data="viewData.age"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="تاريخ الميلاد"
                      :data="viewData.birthday"
                      type="date"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرقم القومي"
                      :data="viewData.nationalId"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الفئة"
                      :data="viewData.degree"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرتبة"
                      :data="viewData.rank"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="اسم الاب"
                      :data="viewData.fatherName"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرقم القومي للاب"
                      :data="viewData.fatherId"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="اسم الام"
                      :data="viewData.motherName"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرقم القومي للام"
                      :data="viewData.motherId"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="العنوان"
                      :data="viewData.address"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الهاتف"
                      :data="viewData.phone"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="رقم الواتساب"
                      :data="viewData.whatsapp"
                      type="string"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title m-0">
              <h3 class="fw-bold م-0">جدول المريض</h3>
            </div>
          </div>
          <div class="p-9">
            <div>
              <div class="table-container" id="TableData">
                <div class="table-responsive">
                  <table
                    ref="tableRef"
                    class="table table-bordered table-hover"
                  >
                    <thead>
                      <tr>
                        <th>الأيام</th>
                        <th v-for="(header, index) in tableHeader" :key="index">
                          {{ header }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(day, dayIndex) in weekDays"
                        :key="dayIndex"
                        v-show="hasSessions[dayIndex]"
                      >
                        <td>{{ day }}</td>
                        <template
                          v-for="(session, sessionIndex) in sessionsTable[
                            dayIndex
                          ]"
                          :key="sessionIndex"
                        >
                          <td
                            v-if="session.department"
                            :colspan="session.colspan"
                          >
                            {{ session.department }}
                          </td>
                          <td
                            v-else-if="
                              !session.department && session.colspan === 1
                            "
                          >
                            &nbsp;
                          </td>
                        </template>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title m-0">
              <h3 class="fw-bold م-0">الكراسات</h3>
            </div>
          </div>
          <div class="container">
            <div class="row mt-5">
              <div
                class="col-md-3 mb-4 card-header"
                v-for="notebook in patientNotebooks"
                :key="notebook._id"
              >
                <el-card
                  style="cursor: pointer"
                  class="box-card"
                  @click="downloadFile(notebook)"
                >
                  <p>
                    <strong>القسم :</strong>
                    <i class="fas fa-file-alt"></i> {{ notebook.department }}
                  </p>
                  <p>
                    <strong>اخر تعديل بتاريخ :</strong>
                    {{ new Date(notebook.modifiedAt).toLocaleString() }}
                  </p>
                </el-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  computed,
  normalizeClass,
} from "vue";
import { usePatientsStore } from "@/stores/patients";
import { useNotebooksStore } from "@/stores/notebook";
import { storeToRefs } from "pinia";

import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import InfoItem from "@/components/info-item.vue";

const store = usePatientsStore();
const storeNotebook = useNotebooksStore();
const { patientNotebooks } = storeToRefs(storeNotebook);
const router = useRouter();
const { proxy } = getCurrentInstance();
const viewData = ref({});
const sessions = ref([]);
const imageData = ref<string | null>(null);
const weekDays = ref([
  "السبت",
  "الاحد",
  "الاثنين",
  "الثلاثاء",
  "الاربعاء",
  "الخميس",
]);
const tableHeader = ref<string[]>([]);

const generateTableHeader = () => {
  const startTime = "09:00";
  const endTime = "14:00";
  const interval = 15; // minutes
  const headers = [];
  let currentTime = new Date(`1970-01-01T${startTime}:00`);
  const endTimeDate = new Date(`1970-01-01T${endTime}:00`);

  while (currentTime < endTimeDate) {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    headers.push(formattedTime);
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }

  tableHeader.value = headers;
};
const sessionsTable = ref(
  new Array(weekDays.value.length)
    .fill(null)
    .map(() =>
      new Array(tableHeader.value.length).fill({ department: "", colspan: 1 })
    )
);

const timeToIndex = (time) => {
  let [hour, minute] = time.split(":").map(Number);

  // Convert 12-hour format to 24-hour format assuming a working hour range from 9 AM to 2 PM
  if (hour === 12) {
    hour = 12; // Keep 12 as is to represent noon
  } else if (hour >= 1 && hour <= 8) {
    hour += 12; // Treat 1 PM to 8 PM as 13:00 to 20:00
  }

  // Calculate the index based on the 12-hour format, starting from 9 AM
  return (hour - 9) * 4 + minute / 15;
};

const hasSessions = computed(() =>
  sessionsTable.value.map((daySessions) =>
    daySessions.some((session) => session.department !== "")
  )
);
const downloadFile = (notebook: any) => {
  const link = document.createElement("a");
  link.href = `http://localhost:3000/notebooks/${notebook.filename}`;
  link.download = notebook.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const submitDelete = async () => {
  const confirmed = await Swal.fire({
    title: "تنبيه!",
    text: "هل أنت متأكد أنك تريد حذف هذا المستخدم؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "تأكيد",
    cancelButtonText: "الغاء",
  });
  if (confirmed.isConfirmed) {
    try {
      await store.deleteItem(viewData.value._id).then(() => {
        router.push({ name: "patients-list" });
        Swal.fire({
          text: "تم حذف المستخدم بنجاح",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-primary",
          },
        });
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        text: "حدث خطأ أثناء محاولة حذف المستخدم",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semobold btn-light-primary",
          cancelButton: "btn fw-semobold btn-light-primary",
        },
      });
    }
  }
};

const printData = async () => {
  const containerId = "kt_app_content_container";
  const container = document.getElementById(containerId);
  if (container) {
    // Hide the card headers temporarily
    const cardHeaders = container.querySelectorAll(".card-header");
    cardHeaders.forEach((header) => {
      header.style.display = "none";
    });

    // Add a class to the container to cancel the card border in print
    container.classList.add("cancel-card-border");

    // Print the content inside the kt_app_content_container div
    await proxy.$htmlToPaper(containerId);

    // Restore the card headers and remove the cancel-card-border class after printing
    cardHeaders.forEach((header) => {
      header.style.display = "flex";
    });
    container.classList.remove("cancel-card-border");
  } else {
    console.error("Element not found!");
  }
};

const previewImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formData = new FormData();
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    formData.append("photo", input.files[0]);
    reader.onload = (e) => {
      imageData.value = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
    store.uploadImage(formData, viewData.value._id);
  }
};
const removeImage = async () => {
  imageData.value = null;
  await store.deletePhoto(viewData.value._id);
  await store.fetchItem(router.currentRoute.value.params.id);
  await store.getPatientSessions(router.currentRoute.value.params.id);
  viewData.value = store.itemData;
  sessions.value = store.patientSessions;
  populateTable();
};

onMounted(async () => {
  generateTableHeader();
  await store.fetchItem(router.currentRoute.value.params.id);
  await store.getPatientSessions(router.currentRoute.value.params.id);
  await storeNotebook.fetchList(router.currentRoute.value.params.id);
  viewData.value = store.itemData;
  sessions.value = store.patientSessions;
  populateTable();
});

onUnmounted(() => {
  store.resetItemData();
});

function populateTable() {
  // Clear the table first
  sessionsTable.value = weekDays.value.map(() =>
    Array(tableHeader.value.length).fill({ department: "", colspan: 1 })
  );

  sessions.value.forEach((session) => {
    const dayIndex = weekDays.value.findIndex((day) => day === session.day);
    const fromIndex = timeToIndex(session.from);
    const toIndex = timeToIndex(session.to);

    if (dayIndex !== -1 && fromIndex !== -1 && toIndex !== -1) {
      // Determine the colspan based on department
      const colspan = session.department === "منتسوري" ? 3 : 2;

      // Place the session in the correct slot
      sessionsTable.value[dayIndex][fromIndex] = {
        department: session.department,
        colspan,
      };

      // Clear the remaining slots in the time range
      for (let i = fromIndex + 1; i < fromIndex + colspan; i++) {
        if (i < tableHeader.value.length) {
          sessionsTable.value[dayIndex][i] = { department: "", colspan: 2 };
        }
      }
    }
  });
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  max-width: 100%;
  font-size: 15px;
}

.table-responsive {
  overflow: auto;
}

.table {
  width: max-content;
  background-color: transparent;
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #ebedf2;
  white-space: wrap;
  text-align: center;
  height: 65px;
}
.table td {
  width: 100px;
}

.user-icon {
  color: green;
}

.submitted-name {
  margin-bottom: 5px;
}

.bin-icon {
  color: red;
}

.bin-icon-container {
  text-align: center;
}

.el-button,
.el-dropdown-item {
  font-size: 16px;
  padding: 20px;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.image-preview img {
  width: 200px; /* Fixed width */
  height: 200px; /* Fixed height */
  object-fit: cover; /* Ensures the image covers the container without distorting */
  border-radius: 50%; /* Makes the image circular */
  display: block;
}

.image-preview .placeholder {
  width: 200px; /* Fixed width */
  height: 200px; /* Fixed height */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
}

.image-preview button {
  margin-top: 10px;
}
.box-card {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  transition: all 0.3s;
}

.box-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
