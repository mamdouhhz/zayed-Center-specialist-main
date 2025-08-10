<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <!--begin::Search-->
        <label for="items-per-page" class="mx-5">
          <select
            class="form-select form-select-sm form-select-solid"
            v-model="size"
            name="items-per-page"
            id="items-per-page"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </label>
        <div
          v-if="searchable"
          class="d-flex align-items-center position-relative my-1"
        >
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute"
            style="margin-right: 16rem"
          />
          <input
            v-model="search"
            @input="searchItems()"
            type="text"
            data-kt-subscription-table-filter="search"
            class="form-control form-control-solid w-250px ps-14"
            placeholder="البحث"
          />
        </div>
        <div>
          <div
            v-if="sort.length"
            class="d-flex align-items-center position-relative my-1 mx-5"
          >
            <el-select
              placeholder="الترتيب حسب"
              clearable
              v-model="sortValue"
              @change="sortItems()"
            >
              <el-option
                v-for="item in sort"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </div>
        </div>

        <!--end::Search-->
      </div>

      <div class="card-toolbar">
        <div
          v-if="isExportable"
          class="d-flex justify-content-end mx-5"
          data-kt-attribute-table-toolbar="base"
        >
          <button type="button" class="btn btn-warning" @click="exportReport">
            <KTIcon icon-name="file-up" icon-class="fs-2" />
            Export Report
          </button>
        </div>
        <div
          v-if="isAdd"
          class="d-flex justify-content-end"
          data-kt-attribute-table-toolbar="base"
        >
          <router-link
            :to="{ name: `${modelNameEng}-create` }"
            type="button"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            اضافة {{ modelNameAr }}
          </router-link>
        </div>
      </div>
    </div>
    <TableContent
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      :header="header"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="emptyTableText"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContent>
    <TableFooter
      @page-change="pageChange"
      :current-page="currentPage"
      v-model:itemsPerPage="size"
      :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
      :total-pages="totalPages"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooter.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "kt-datatable",
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    total: { type: Number, required: false },
    loading: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    sort: { type: Array, required: false, default: () => [] },
    emptyTableText: { type: String, required: false, default: "" },
    modelNameEng: { type: String, required: true },
    modelNameAr: { type: String, required: true },
    currentPage: { type: Number, required: false, default: 1 },
    totalPages: { type: Number, required: true },
    filters: { type: Object, default: () => {} },
    filterOperation: { type: String, default: "or" },
    searchable: { type: Boolean, default: false },
    isExportable: { type: Boolean, default: true },
    isAdd: { type: Boolean, default: true },
  },
  emits: [
    "page-change",
    "on-sort",
    "on-items-select",
    "on-page-size-change",
    "on-search",
    "exportReport",
  ],
  components: {
    TableContent,
    TableFooter,
  },
  setup(props, { emit }) {
    const currentPage = ref(props.currentPage);
    const size = ref<number>(props.itemsPerPage);
    const search = ref<string>("");
    const sortValue = ref<string>("");
    watch(
      () => size.value,
      (val) => {
        currentPage.value = 1;
        emit("on-page-size-change", val);
      }
    );
    const searchItems = () => {
      emit("on-search", formattedFilters());
    };
    const sortItems = () => {
      emit("on-sort", sortValue);
    };
    const pageChange = (page: number) => {
      currentPage.value = page;
      emit("page-change", page);
    };
    const exportReport = () => {
      emit("exportReport");
    };

    const dataToDisplay = computed(() => {
      if (props.data) {
        if (props.data.length <= size.value) {
          return props.data;
        } else {
          let sliceFrom = (currentPage.value - 1) * size.value;
          return props.data.slice(sliceFrom, sliceFrom + size.value);
        }
      }
      return [];
    });

    const totalItems = computed(() => {
      if (props.data) {
        if (props.data.length <= size.value) {
          return props.total;
        } else {
          return props.data.length;
        }
      }
      return 0;
    });

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    //eslint-disable-next-line
    const onItemSelect = (selectedItems: any) => {
      emit("on-items-select", selectedItems);
    };
    const formattedFilters = (): string => {
      let filterArray: string[] = [];

      for (const key in props.filters) {
        if (
          props.filters[key] &&
          props.filters[key] !== null &&
          props.filters[key] !== ""
        ) {
          filterArray.push(
            `${key} eq ${
              typeof props.filters[key] === "string"
                ? `"${props.filters[key]}"`
                : props.filters[key]
            }`
          );
        }
      }

      let filter = filterArray.join(`${props.filterOperation} `);

      if (search.value && search.value.length) {
        filter = `${filter && filter.length ? props.filterOperation : ""}${
          search.value
        }`;
      }

      console.log(filter);

      return filter;
    };

    return {
      pageChange,
      dataToDisplay,
      onSort,
      onItemSelect,
      size,
      totalItems,
      search,
      searchItems,
      formattedFilters,
      exportReport,
      sortValue,
      sortItems,
    };
  },
});
</script>
