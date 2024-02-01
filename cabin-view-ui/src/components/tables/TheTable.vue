<template>
  <div class="table-container">
    <DataTable
      v-model:filters="filters"
      class="table"
      :value="palletStatus"
      paginator
      reorderable-columns
      removable-sort
      show-gridlines
      filter-display="menu"
      :rows="5"
      data-key="id"
      :rows-per-page-options="[5, 10, 20, 50]"
      table-style="height:100%;"
      paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      current-page-report-template="{first} to {last} of {totalRecords}"
      :pt="{
        header: {
          style: {
            height: '20vh',
          },
        },
        wrapper: {
          style: {
            height: '70vh',
          },
        },
        paginator: {
          style: {
            height: '10vh',
            position: 'absolute',
            bottom: '0',
            width: '100%',
          },
        },
      }"
    >
      <template #header>
        <Button
          class="back-button"
          icon="pi pi-arrow-left"
          rounded
          text
          severity="secondary"
          aria-label="Filter"
          size="large"
          @click="$router.push('/')"
        />
        <div class="header-div">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="searchName"
              placeholder="Search"
              class="searchbar"
              @input="searchPallet()"
            />
          </span>
          <span v-if="selectedState && selectedState.name" class="table-header"
            >{{ selectedState.name }} Pallets</span
          >
          <span v-else class="table-header">Pallets</span>
          <Dropdown
            v-model="selectedState"
            :options="states"
            show-clear
            option-label="name"
            placeholder="All"
            class="dropdown"
            @change="loadDropdownValue()"
          />
        </div>
      </template>
      <template #empty> No pallets found. </template>
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
import type { PalletStates } from "@/types/palletStatus";

const filters = ref();
const palletStatusStore = usePalletStatusStore();
const searchName = ref("");
const selectedState = ref<PalletStates | null>(null);
const states = ref<PalletStates[]>([
  { name: "Misplaced", value: "Misplaced" },
  { name: "In Place", value: "InPlace" },
  { name: "On Floor", value: "OnFloor" },
  { name: "Missing", value: "Missing" },
  { name: "In Transit", value: "InTransit" },
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

async function loadDropdownValue(): Promise<void> {
  if (selectedState.value) {
    const { value } = selectedState.value;
    await palletStatusStore.loadDataByPalletState(value);
  } else {
    await palletStatusStore.loadData();
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
.table {
  width: 100%;
  height: 100%;
}
.table-header {
  font-size: 2rem;
}

.header-div {
  margin-top: 2.5vh;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.searchbar {
  width: 25rem;
}

.dropdown {
  width: 25rem;
}
</style>
