<template>
  <section>
    <div id="kt_app_content_container" class="app-container container-fluid">
      <div class="card mb-5 mb-xl-10" id="kt_patients_details_view">
        <div class="card">
          <div class="card-header">
            <div class="card-title m-0">
              <h3 class="fw-bold m-0">جدول الجلسات</h3>
            </div>
          </div>
          <div class="p-9">
            <div>
              <div class="table-container">
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
                      <tr v-for="(day, dayIndex) in weekDays" :key="dayIndex">
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
                            {{ session.patient }} <br />
                            <span class="user-icon">{{
                              session.specialist
                            }}</span>
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
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useSpecialistSessionsStore } from "@/stores/specialistSessions";
const store = useSpecialistSessionsStore();

const sessions = ref([]);
const weekDays = ref([
  "السبت",
  "الاحد",
  "الاثنين",
  "الثلاثاء",
  "الاربعاء",
  "الخميس",
]);

const tableHeader = ref<string[]>([]);

const sessionsTable = ref(
  Array.from({ length: weekDays.value.length }, () =>
    Array.from({ length: tableHeader.value.length }, () => [])
  )
);

// Function to convert time string to index in the table header
const timeToIndex = (time) => {
  let [hour, minute] = time.split(":").map(Number);

  // Correctly interpret the 12-hour format by considering the table's start time
  // Assume your sessions run from 09:00 AM to 02:00 PM
  // So 09:00 means 9 AM, 01:00 means 1 PM (if ignoring AM/PM)

  // Treat 12 as noon (e.g., 12:30 means 12:30 PM)
  // If time is "01:00", treat it as 1 PM, considering it in the afternoon context
  if (hour === 12) {
    hour = 12; // Noon case, keep as 12
  } else if (hour < 9) {
    hour += 12; // Treating it as PM if it's less than 9 (e.g., 1 -> 13, 2 -> 14)
  }

  // Calculate the index based on 12-hour time format
  return (hour - 9) * 4 + minute / 15;
};

onMounted(async () => {
  generateTableHeader();
  await store.fetchList();
  sessions.value = store.ListData;
  populateTable();
});

onUnmounted(() => {
  //   store.resetItemData();
});

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
        patient: session.patient.name,
        specialist: session.specialist.username,
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
/* Add your CSS styling here */
.table-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  max-width: 100%; /* Adjust the max-width as needed */
  font-size: 15px;
}

.table-responsive {
  overflow: auto; /* Ensure table content scrolls */
}

.table {
  width: max-content; /* Set table width to max-content for horizontal scrolling */
  background-color: transparent;
  width: 100%; /* Set table width to 100% */
  border-collapse: collapse; /* Collapse border spacing */
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #ebedf2;
  white-space: wrap; /* Prevent text wrapping */
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
  margin-bottom: 5px; /* Adjust the margin to separate the name from the bin icon */
}

.bin-icon {
  color: red;
}

.bin-icon-container {
  text-align: center;
}

/* Separator styling */
.session-separator {
  margin: 5px 0;
  border: 0;
  border-top: 1px solid #eee;
}

/* Increase font size of button and dropdown text */
.el-button,
.el-dropdown-item {
  font-size: 16px;
  padding: 20px;
}

/* Your existing CSS styles for .table, .table th, .table td, etc. */
</style>
