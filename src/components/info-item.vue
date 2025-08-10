<template>
  <div class="mt-2" v-if="data !== undefined">
    <div class="row mb-7">
      <!--begin::Label-->
      <label class="col-lg-4 fw-semobold text-muted">{{ label }}</label>
      <!--end::Label-->

      <!--begin::Col-->
      <div class="col-lg-8">
        <span class="fw-bold fs-6">
          <div v-if="type == 'hasOne'">
            {{ data[displayName] ? data[displayName] : "--" }}
          </div>

          <div v-else-if="type === 'boolean'">
            <i class="bi bi-check-all fs-1" v-if="data"></i>
            <i class="bi bi-x-lg fs-3" v-else></i>
          </div>
          <div v-else-if="type === 'image'">
            <img
              :src="data && data.url ? data.url : ''"
              :height="150"
              class="m-1 rounded"
              alt="Rounded image"
            />
          </div>

          <div v-else-if="type === 'file'">
            <a v-if="data && data.fileName" :href="data.url" target="_blank">{{
              data.fileName
            }}</a>
          </div>

          <div v-else-if="type === 'dateTime'">
            <span v-if="data"> {{ $filters.FormatDateTime(data) }} </span>
          </div>
          <div v-else-if="type === 'date'">
            <span v-if="data"> {{ $filters.FormatDate(data) }} </span>
          </div>

          <div v-else>
            {{ data ? data : "--" }}
          </div></span
        >
      </div>
      <!--end::Col-->
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "InfoItem",
  props: {
    label: {
      type: String,
      required: false,
    },
    data: {
      type: [String, Object, Array, Boolean, Number],
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    onMounted(() => {});
    return {};
  },
});
</script>

<style></style>
