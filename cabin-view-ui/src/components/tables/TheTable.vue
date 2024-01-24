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
      table-style="min-width: 50rem; min-height: 67.8vh;"
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
          <span class="table-header">Pallets</span>
        </div>
      </template>
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="Name" header="Name" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.Name }}
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
      <Column field="Place" header="Place" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.Place }}
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
import { ref, onMounted } from "vue";
import { usePalletStatusStore } from "@/stores/palletStatusStore";
import type { PalletStatuses } from "@/types/palletStatus";
import { FilterMatchMode, FilterOperator } from "primevue/api";

const filters = ref();

const palletStatusStore = usePalletStatusStore();
const palletStatus = ref([] as PalletStatuses[]);

onMounted(async () => {
  await palletStatusStore.loadTestData();
  palletStatus.value = palletStatusStore.palletStatus;
  initFilters();
});

function initFilters(): void {
  filters.value = {
    Name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    Place: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  };
}

function clearFilter(): void {
  initFilters();
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
