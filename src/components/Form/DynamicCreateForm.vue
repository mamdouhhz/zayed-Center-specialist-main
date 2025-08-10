<template>
  <div>
    <Form
      class="form el-form el-form--default el-form--label-right el-form el-form--large el-form--label-top"
      as="v-form"
      ref="formRef"
      v-slot="{ setFieldValue }"
      label-width="80px"
      :inline="false"
      size="default"
      label-position="top"
      :validate-on-rule-change="false"
      @submit="onSubmit"
    >
      <el-row class="mt-10" :gutter="20">
        <el-col
          class="fv-row mb-7"
          :span="12"
          v-for="input in formFields"
          :key="input.name"
        >
          <Field
            :name="input.name"
            :rules="input.rules"
            v-slot="{ field, errors }"
            :value="localFormData[input.name]"
            v-if="
              (input.display && input.display['create'] == true) ||
              input.attributeType === 'hasOne'
            "
          >
            <el-form-item
              :class="{
                'required-field': input.rules.includes('required'),
              }"
              :label="input.label"
              :prop="input.name"
              :error="errors[0]"
            >
              <el-input
                v-if="input.attributeType === 'string'"
                v-model="localFormData[input.name]"
                :placeholder="input.placeholder"
                v-bind="field"
              ></el-input>

              <el-input-number
                v-else-if="
                  input.attributeType == 'int' ||
                  input.attributeType == 'decimal'
                "
                v-model.number="localFormData[input.name]"
                type="number"
                :placeholder="input.placeholder"
                :min="input.min !== undefined ? input.min : -Infinity"
                :max="input.max !== undefined ? input.max : Infinity"
                v-bind="field"
              ></el-input-number>

              <el-input
                v-else-if="input.attributeType === 'email'"
                v-model="localFormData[input.name]"
                type="email"
                :placeholder="input.placeholder"
                v-bind="field"
              ></el-input>
              <el-checkbox
                v-else-if="input.attributeType === 'boolean'"
                v-model="localFormData[input.name]"
                type="boolean"
                v-bind="field"
                false-value="false"
              ></el-checkbox>
              <el-date-picker
                v-else-if="input.attributeType === 'date'"
                v-model="localFormData[input.name]"
                type="date"
                :placeholder="input.placeholder"
                v-bind="field"
              ></el-date-picker>
              <el-date-picker
                v-else-if="input.attributeType === 'dateTime'"
                v-model="localFormData[input.name]"
                type="datetime"
                :placeholder="input.placeholder"
                v-bind="field"
              ></el-date-picker>
              <el-time-picker
                v-else-if="input.attributeType === 'time'"
                v-model="localFormData[input.name]"
                value-format="HH:mm:ss"
                :placeholder="input.placeholder"
                v-bind="field"
              ></el-time-picker>
              <el-input
                v-else-if="input.attributeType === 'text'"
                v-model="localFormData[input.name]"
                type="textarea"
                :placeholder="input.placeholder"
                v-bind="field"
              ></el-input>
              <el-upload
                v-else-if="input.attributeType === 'file'"
                class="form-control"
                :on-change="
                  (file) =>
                    handleFileUpload(
                      input.name,
                      input.allowedExtensions,
                      file,
                      setFieldValue
                    )
                "
                :accept="input.allowedExtensions.join(', ')"
                :before-upload="() => false"
                :model-value="localFormData[input.name]"
              >
                <el-button size="small" type="primary"
                  >Click to upload</el-button
                >
                <div v-if="localFormData[input.name]">
                  {{ localFormData[input.name].fileName }}
                </div>
              </el-upload>
              <el-upload
                v-else-if="input.attributeType === 'image'"
                class="form-control"
                :on-change="
                  (file) =>
                    handleImageUpload(
                      input.name,
                      input.allowedExtensions,
                      file,
                      setFieldValue
                    )
                "
                :accept="input.allowedExtensions.join(', ')"
                :before-upload="() => false"
                :model-value="localFormData[input.name]"
              >
                <el-button size="small" type="primary"
                  >Click to upload</el-button
                >
                <div v-if="localFormData[input.name]">
                  {{ localFormData[input.name].fileName }}
                </div>
              </el-upload>

              <el-input
                v-else-if="input.attributeType === 'password'"
                v-model="localFormData[input.name]"
                type="password"
                :placeholder="input.placeholder"
                v-bind="field"
              ></el-input>
              <el-select
                v-if="input.attributeType === 'enumeration'"
                v-model="localFormData[input.name]"
                :placeholder="input.placeholder"
                clearable
                filterable
                v-bind="field"
              >
                <el-option
                  v-for="item in input.options"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <hasOneSelection
                v-if="input.attributeType === 'hasOne'"
                :attribute="input"
                @select="
                  handleSelectionChange($event, input.name, setFieldValue)
                "
              >
              </hasOneSelection>
            </el-form-item>
          </Field>
        </el-col>
        <el-col class="fv-row mb-7" :span="12">
          <slot name="department"></slot>
        </el-col>
      </el-row>
      <el-form-item>
        <div class="w-100 d-flex justify-content-center">
          <el-button class="mx-3" type="primary" @click="onSubmit"
            >تأكيد</el-button
          >
          <el-button v-if="reset" type="default" @click="resetForm"
            >إعادة تعيين</el-button
          >
        </div>
      </el-form-item>
    </Form>
  </div>
</template>

<script>
import JwtService from "@/core/services/JwtService";
import { useMediaStore } from "@/stores/media";
import { defineComponent, onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import hasOneSelection from "@/components/Form/hasOneSelection.vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
  ElTimePicker,
  ElCheckbox,
  ElInputNumber,
  ElUpload,
} from "element-plus";
import { Form, Field, ErrorMessage } from "vee-validate";
import moment from "moment";

export default defineComponent({
  props: {
    formFields: {
      type: Array,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    reset: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElDatePicker,
    ElCheckbox,
    ElInputNumber,
    ElUpload,
    Form,
    Field,
    ErrorMessage,
    hasOneSelection,
  },
  setup(props, { emit }) {
    const user = JwtService.getUser();
    const media = useMediaStore();
    const formRef = ref();
    const localFormData = ref(JSON.parse(JSON.stringify(props.formData)));
    const handleImageUpload = async (
      name,
      allowedExtensions,
      file,
      setFieldValue
    ) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isValidExtension = allowedExtensions.some((ext) => {
        return ext.toLowerCase().includes(fileExtension);
      });
      if (!isValidExtension) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid File Type",
        }).then(() => {
          localFormData.value[name] = null;
          setFieldValue(name, null);
        });
        return;
      }

      const fileData = await media.fileUpload(file.raw);
      localFormData.value[name] = fileData;
      setFieldValue(name, fileData);
    };
    watch(
      () => localFormData.value,
      (value) => {
        emit("updateFormData", value);
      },
      { deep: true }
    );

    const handleFileUpload = async (
      name,
      allowedExtensions,
      file,
      setFieldValue
    ) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isValidExtension = allowedExtensions.some((ext) => {
        return ext.toLowerCase().includes(fileExtension);
      });
      if (!isValidExtension) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid File Type",
        }).then(() => {
          setFieldValue(name, null);
          localFormData.value[name] = null;
        });
        return;
      }

      const fileData = await media.fileUpload(file.raw);
      localFormData.value[name] = fileData;
      setFieldValue(name, fileData);
    };
    const handleSelectionChange = (selectedOption, name, setFieldValue) => {
      localFormData.value[name] = selectedOption;
      setFieldValue(name, selectedOption);
    };

    const onSubmit = () => {
      formRef.value.validate().then((valid) => {
        if (valid.valid) {
          let payload = JSON.parse(JSON.stringify(localFormData.value));
          props.formFields.forEach((input) => {
            if (input.attributeType == "time") {
              payload[input.name] = moment(
                "1970-01-01T" + payload[input.name]
              ).toISOString();
            }
          });
          emit("submit", payload);
        } else {
          return false;
        }
      });
    };
    const resetForm = () => {
      formRef.value.resetForm();
    };
    onMounted(async () => {});
    return {
      handleImageUpload,
      handleFileUpload,
      onSubmit,
      user,
      resetForm,
      formRef,
      onMounted,
      localFormData,
      handleSelectionChange,
    };
  },
});
</script>
<style lang="scss">
.el-select {
  width: 100%;
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
