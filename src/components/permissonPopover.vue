<template>
  <button
    :id="code"
    :class="`${
      permission ? permission.permissionScope : 'NONE'
    }-shape shape-button`"
    :disabled="permission && !permission.configurable"
    :title="permission ? permission.permissionScope : 'NONE'"
    ref="buttonRef"
    v-click-outside="onClickOutside"
  ></button>

  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    virtual-triggering
  >
    <div class="list-of-scopes">
      <button
        v-for="item in scopeList"
        :key="item"
        :class="`shape-button ${item}-shape`"
        :title="item"
        @click="assignPermission(item)"
      ></button>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, unref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
const buttonRef = ref();
const popoverRef = ref();
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};

const props = defineProps({
  scopeList: {
    type: Array,
    required: false,
  },
  permission: {
    type: Object,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
});

// Emit event
const emit = defineEmits(["assign"]);

// Assign permission
const assignPermission = (item: any) => {
  emit("assign", {
    ...(props.permission && { id: props.permission.id }),
    permissionCode: props.code,
    permissionScope: item,
  });

  closePopover();
};

// Close popover
const closePopover = () => {
  const popover = unref(popoverRef);
  popover.hide();
};
</script>

<style lang="scss">
.list-of-scopes {
  display: flex;
  align-items: center;
  justify-content: center;
}
.shape-button {
  background-color: transparent;
  border: 2px solid;
  min-width: 20px;
  max-width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
  &:hover {
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }
}
.NONE-shape {
  border-color: #ff4000;
}
.PARENTBU-shape {
  border-color: #bcb994;
  background-color: #bcb994;
}
.OWNER-shape {
  border-color: #ffd700;
  background-color: #ffd700;
}
.BU-shape {
  border-color: #301813;
  background-color: #301813;
}
.ALL-shape {
  border-color: #b9a69b;
  background-color: #b9a69b;
}
</style>
