<template>
  <div>
    <el-select
      filterable
      clearable
      v-model="selectedOption"
      :placeholder="attribute.placeholder"
      @change="handleSelectionChange"
    >
      <el-option
        v-for="item in ArrayData"
        :key="item._id"
        :label="item[attribute.displayName]"
        :value="item._id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { defineComponent, onMounted, ref, watch } from "vue";
import axios from "axios";

export default defineComponent({
  name: "hasOneSelection",
  props: {
    attribute: {
      type: Object,
      required: true,
    },
    selected: {
      type: String,
      required: false,
    },
  },
  components: {},
  setup(props, { emit }) {
    const modelName = ref();
    const ArrayData = ref([]);
    const selectedOption = ref(null);

    const handleSelectionChange = () => {
      emit("select", selectedOption.value);
    };

    watch(
      () => props.selected,
      (newValue) => {
        selectedOption.value = newValue;
      }
    );

    onMounted(async () => {
      console.log(props.attribute.name);
      modelName.value = props.attribute.api;
      try {
        const response = await axios.get(
          `${import.meta.env.BASE_URL + modelName.value}`,
          {
            params: {
              limit: 999999, // Assuming bignumber is defined elsewhere
            },
          }
        );
        ArrayData.value = response.data.data.results;
      } catch (error) {
        console.error(error);
      }
    });
    return {
      modelName,
      selectedOption,
      ArrayData,
      handleSelectionChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-select {
  width: 450px !important;
}
.el-form-item__label {
  text-align: right !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 100%;
}
.el-input-number {
  width: 100%;
}
</style>
