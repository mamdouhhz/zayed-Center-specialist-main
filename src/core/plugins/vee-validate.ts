import { configure, defineRule } from "vee-validate";
import {
  required,
  email,
  min,
  max,
  min_value,
  max_value
} from "@vee-validate/rules";

export function initVeeValidate() {
  // Updating default vee-validate configuration
  configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
    validateOnModelUpdate: true
  });
}

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);
defineRule("min_value", min_value);
defineRule("max_value", max_value);
defineRule("decimal", (value: string) => {
  if (!value) {
    return true;
  }
  if (!/^\d+(\.\d+)?$/.test(value)) {
    return "This field must be a valid decimal";
  }
  return true;
});
defineRule("ar", (value: string) => {
  if (!value) {
    return true;
  }
  if (!/^[\u0600-\u06FF\s0-9]+$/.test(value)) {
    return "This field must contain Arabic characters and numbers only";
  }
  return true;
});

defineRule("en", (value: string) => {
  if (!value) {
    return true;
  }
  if (!/^[a-zA-Z\s0-9]+$/.test(value)) {
    return "This field must contain English characters and numbers only";
  }
  return true;
});
