<template>
  <div class="table-container">
    <DataTable
      v-model:filters="filters"
      :value="palletStatus"
      paginator
      reorderable-columns
      removable-sort
      show-gridlines
      filter-display="menu"
      :rows="5"
      data-key="id"
      :rows-per-page-options="[5, 10, 20, 50]"
      table-style="min-width: 100vw; height: fit-content;"
      paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      current-page-report-template="{first} to {last} of {totalRecords}"
    >
      <template #header>
        <Button
          class="back-button"
          icon="pi pi-arrow-left"
          rounded
          aria-label="Filter"
          @click="$router.push('/')"
        />
        <div class="header-div">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="searchName"
              placeholder="Search"
              @input="searchPallet"
            />
          </span>
          <span class="table-header">Pallets</span>
          <Dropdown
            v-model="selectedState"
            :options="cities"
            show-clear
            option-label="name"
            placeholder="Select a City"
            class="w-full md:w-14rem"
          />
        </div>
      </template>
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="name" header="Name" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column field="place" header="Place" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.place }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by place"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { ref, onMounted, computed } from "vue";
import { usePalletStatusStore } from "@/stores/palletStatusStore";
import { FilterMatchMode, FilterOperator } from "primevue/api";

const filters = ref();
const palletStatusStore = usePalletStatusStore();
const searchName = ref("");
const selectedState = ref("");
const cities = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);
const palletStatus = computed(() => palletStatusStore.palletStatus);

onMounted(async () => {
  initFilters();
});

function initFilters(): void {
  filters.value = {
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    place: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  };
}

async function searchPallet(): Promise<void> {
  if (searchName.value.trim() === "") {
    await palletStatusStore.loadData();
  } else {
    await palletStatusStore.searchPallet(searchName.value);
  }
}
</script>

<style lang="scss" scoped>
.table-header {
  font-size: 2rem;
}

.header-div {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
