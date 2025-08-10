<template>
  <!--begin::Aside-->
  <div
    class="d-flex flex-lg-row-fluid w-lg-100 bgi-size-cover bgi-position-center order-1 order-lg-2"
    :style="`background-image: url('${getAssetPath(
      '/media/misc/auth-bg.png'
    )}')`"
  >
    <!--begin::Content-->
    <div
      class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100"
    >
      <!--begin::Logo-->
      <router-link to="/" class="mb-0 mb-lg-12">
        <img
          alt="Logo"
          :src="getAssetPath('media/logos/custom-1.png')"
          class="h-400px h-lg-600px"
        />
      </router-link>
      <!--end::Logo-->
    </div>
    <!--end::Content-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAssetPath } from "@/core/helpers/assets";

export default defineComponent({
  name: "main-dashboard",
  components: {},
  setup() {
    return { getAssetPath };
  },
});
</script>
