<template>
  <div class="mt-2">
    <div v-if="type === 'hasOne'">
      {{ data[displayName] }}
    </div>

    <div v-else-if="type === 'translation'">
      {{ translate(data) }}
    </div>

    <div v-else-if="type === 'boolean'">
      <i class="bi bi-x-lg fs-3" v-if="!data"></i>
      <i class="bi bi-x-lg fs-3" v-else-if="data == 'SUSPENDED'"></i>
      <i class="bi bi-check-all fs-1" v-else></i>
    </div>

    <div v-else-if="type === 'enum'">
      <span v-for="item in data" :key="item">{{ item }}</span>
    </div>

    <div v-else-if="type === 'image'">
      <img
        :src="data.url"
        :height="75"
        class="m-1 rounded"
        alt="Rounded image"
      />
    </div>

    <div v-else-if="type === 'file'">
      <a :href="data.url" target="_blank">{{ data.fileName }}</a>
    </div>

    <div v-else-if="type === 'dateTime'">
      {{ $filters.FormatDateTime(data) }}
    </div>
    <div v-else-if="type === 'date'">
      {{ $filters.FormatDate(data) }}
    </div>

    <div v-else>
      {{ data ? data : "--" }}
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "InfoItemTable",
  props: {
    data: { type: [String, Object, Array, Number, Boolean], required: true },
    type: { type: String, required: true },
    displayName: { type: String, required: false },
  },
  setup(props) {
    return {
      // Return any variables or functions you need here
    };
  },
});
</script>

<style>
/* Add any custom Bootstrap 5 styling here */
</style>
