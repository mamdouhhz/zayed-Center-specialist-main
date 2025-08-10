<template>
  <div>
    <!-- List all uploaded notebooks -->
    <el-card
        v-for="notebook in patientNotebooks"
        :key="notebook._id"
        class="box-card"
    >
      <div class="file-info">
        <h3>الكراسة</h3>
        <p><strong>الاسم : </strong> {{ notebook.filename }}</p>
      </div>
      <div class="file-actions">
        <el-button
            type="primary"
            icon="el-icon-download"
            @click="downloadFile(notebook)"
        >
          تحميل
        </el-button>
        <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteFile(notebook)"
        >
          مسح
        </el-button>
      </div>
    </el-card>

    <!-- Upload button always visible -->
    <el-upload
        ref="fileUpload"
        action=""
        :http-request="uploadFile"
        auto-upload
        show-file-list="false"
        accept=".doc,.docx"
        :limit="5"
        :on-exceed="handleExceed"
        :file-list="[]"
    >
      <el-button type="primary" style="margin-top: 20px; margin-right: 20px;">رفع كراسه</el-button>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useNotebooksStore } from "@/stores/notebook";
import { storeToRefs } from "pinia";

const store = useNotebooksStore();
const { patientNotebooks } = storeToRefs(store);
const router = useRouter();
const id = ref(router.currentRoute.value.params.id);

// Load list of notebooks on mount
onMounted(async () => {
  await store.fetchList(id.value);
});

const uploadFile = async (params) => {
  const { file } = params;
  const formData = new FormData();

  const isWord =
      file.type === "application/msword" ||
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (!isWord) {
    ElMessage.error("You can only upload Word files.");
    return;
  }

  formData.append("file", file);

  try {
    await store.create(id.value, formData);
    ElMessage.success("File uploaded successfully");
    await store.fetchList(id.value); // Refresh list
  } catch (error) {
    ElMessage.error("Failed to upload file");
    console.error(error);
  }
};

const downloadFile = (notebook) => {
  const link = document.createElement("a");
  link.href = `http://localhost:3000/notebooks/${notebook.filename}`;
  link.download = notebook.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const deleteFile = async (notebook) => {
  try {
    await store.deleteItem(notebook._id);
    ElMessage.success("File deleted successfully");
    await store.fetchList(id.value); // Refresh list
  } catch (error) {
    ElMessage.error("Failed to delete file");
    console.error(error);
  }
};

const handleExceed = () => {
  ElMessage.warning("You can upload up to 5 files at a time.");
};
</script>

<style scoped lang="scss">
.box-card {
  margin: 20px;
  .file-info {
    margin-bottom: 20px;
    h3 {
      margin-bottom: 10px;
    }
    p {
      margin: 0;
      line-height: 1.5;
    }
  }
  .file-actions {
    display: flex;
    gap: 10px;
  }
}
</style>