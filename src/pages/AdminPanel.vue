<script setup>
import { onMounted, ref, watch } from 'vue';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
/////////////////////Table
const loadingTabel = ref(true);
const data = ref([]);
const columns = [
  { name: 'ID', label: '#', field: 'id', required: true, sortable: true },
  {
    name: 'ProductName',
    label: 'ProductName',
    field: 'Product_name',
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'ProductPrice',
    label: 'ProductPrice',
    field: 'Product_price',
    format: (val) => `${val}$`,
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'Inventory',
    label: 'Inventory',
    field: 'Inventory',
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'supplier',
    label: 'Supplier',
    field: 'Supplier',
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'category',
    label: 'Category',
    field: 'Category',
    required: true,
    sortable: true,
    align: 'center',
  },
];
const filteredData = ref([]);
const SelectProduct = ref([]);
const errors = ref({});
/////////////////////Edit Product
const editDialog = ref(false);
const editData = ref({});
/////////////////////Edit Product
const confirmDelete = ref(false);
const productDetails = ref({});
/////////////////////Add Product
const AddDialog = ref(false);
const addProduct = ref({
  Product_name: '',
  Product_price: '',
  Inventory: '',
  Supplier: '',
  Category: '',
});
/////////////////////Search
const search = ref('');

// Get Data From Node Js
async function fetchData() {
  loadingTabel.value = true;
  try {
    const response = await api.get('/data');
    setTimeout(() => {
      data.value = response.data;
      filteredData.value = data.value;
      loadingTabel.value = false;
    }, 500);
  } catch (error) {
    console.log(error);
  }
}
// Open Edit Dialog And Placing Values
function openEditDialog(row) {
  editDialog.value = true;
  editData.value = { ...row };
}
// Post NewData for NodeJs
async function PostNewDataProduct() {
  try {
    await api.post('/editProducts', editData.value);
    SelectProduct.value = [];
    editDialog.value = false;
    fetchData();
  } catch (error) {
    console.log(error);
  }
}
// Open Delete Dialog And Placing Values
function openDeleteDialog(row) {
  confirmDelete.value = true;
  productDetails.value = { ...row };
}
// Delete Product
async function PostProductDetails() {
  try {
    await api.delete('/deleteProduct', { data: productDetails.value });
    SelectProduct.value = [];
    confirmDelete.value = false;
    fetchData();
  } catch (error) {
    console.log(error);
  }
}
// Add Product
async function AddNewProduct() {
  try {
    errors.value = {};
    const validateForm = () => {
      for (const key in addProduct.value) {
        if (!addProduct.value[key]) {
          errors.value[key] = 'This field must not be empty';
        }
      }
      return Object.keys(errors.value).length === 0;
    };
    if (validateForm()) {
      await api.post('/createProduct', addProduct.value);
      AddDialog.value = false;
      fetchData();
    } else {
      Notify.create({ type: 'negative', message: 'Please complete all entries' });
    }
  } catch (error) {
    console.log(error);
  }
}
//  Search Function
const performSearch = () => {
  if (search.value) {
    filteredData.value = data.value.filter((product) => {
      const searchTerm = search.value.toLowerCase();
      return (
        (product.Product_name && product.Product_name.toLowerCase().includes(searchTerm)) ||
        (product.Product_price &&
          product.Product_price.toString().toLowerCase().includes(searchTerm)) ||
        (product.Category && product.Category.toLowerCase().includes(searchTerm)) ||
        (product.Inventory && product.Inventory.toString().toLowerCase().includes(searchTerm)) ||
        (product.Supplier && product.Supplier.toLowerCase().includes(searchTerm))
      );
    });
  } else {
    filteredData.value = data.value;
  }
};

watch(search, (newValue) => {
  if (!newValue.trim()) {
    filteredData.value = [...data.value];
  }
});
onMounted(() => {
  fetchData();
});
</script>

<template>
  <q-page class="flex flex-center" padding>
    <div class="full-width column items-center">
      <q-input
        v-model="search"
        type="text"
        outlined
        placeholder="Search:"
        class="q-mb-xl"
        style="width: 500px"
      >
        <template v-slot:append>
          <q-btn
            color="negative"
            icon="close"
            flat
            dense
            round
            v-if="search != ''"
            @click="search = ''"
          />
          <q-btn color="orange-6" icon="search" flat dense round @click="performSearch" />
        </template>
      </q-input>
      <q-table
        title="Product details"
        :rows="filteredData"
        :columns="columns"
        row-key="id"
        :loading="loadingTabel"
        class="full-width q-mt-xl"
        selection="single"
        v-model:selected="SelectProduct"
        color="amber"
      >
        <template v-slot:top-right>
          <div class="row q-gutter-x-sm">
            <div class="q-gutter-x-sm" v-if="SelectProduct.length > 0">
              <q-btn color="orange-6" dense icon="edit" @click="openEditDialog(SelectProduct[0])" />
              <q-btn
                color="negative"
                dense
                icon="delete"
                @click="openDeleteDialog(SelectProduct[0])"
              />
            </div>
            <div v-else class="q-gutter-x-sm">
              <q-btn color="primary" dense icon="add" @click="AddDialog = true" />
              <q-btn color="amber" dense icon="autorenew" @click="fetchData()" />
            </div>
          </div>
        </template>
      </q-table>
      <!-- Edit Dialog -->
      <q-dialog v-model="editDialog" persistent>
        <q-card>
          <q-card-actions align="right" class="q-pb-none q-pt-xs">
            <q-btn color="negative" flat dense icon="close" round v-close-popup />
          </q-card-actions>
          <q-card-section class="column items-center q-pt-xs">
            <q-form class="Form" style="min-width: 300px">
              <div class="q-gutter-md q-mb-xl">
                <q-input
                  v-model="editData.Product_name"
                  standout="bg-primary text-white"
                  stack-label
                  type="text"
                  label="ProductName"
                />
                <q-input
                  v-model="editData.Product_price"
                  standout="bg-primary text-white"
                  stack-label
                  type="text"
                  label="ProductPrice"
                />
                <q-input
                  v-model="editData.Inventory"
                  standout="bg-primary text-white"
                  stack-label
                  type="text"
                  label="Inventory"
                />
                <q-input
                  v-model="editData.Supplier"
                  standout="bg-primary text-white"
                  stack-label
                  type="text"
                  label="Supplier"
                />
                <q-input
                  v-model="editData.Category"
                  standout="bg-primary text-white"
                  stack-label
                  type="text"
                  label="Category"
                />
              </div>
              <q-btn
                label="Edit"
                icon="edit"
                class="full-width"
                color="primary"
                @click="PostNewDataProduct"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Confirm Delete -->
      <q-dialog v-model="confirmDelete" persistent>
        <q-card class="confirmDelete">
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="negative" text-color="white" size="lg" />
            <span class="q-ml-sm">Are you sure you want to delete this product?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Delete" color="negative" icon="delete" @click="PostProductDetails" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="AddDialog" persistent>
        <q-card>
          <q-card-actions align="right" class="q-pb-none q-pt-xs">
            <q-btn color="negative" flat dense icon="close" round v-close-popup />
          </q-card-actions>
          <q-card-section class="column items-center q-pt-xs">
            <q-form class="Form" style="min-width: 300px">
              <div class="q-gutter-md q-mb-xl">
                <q-input
                  v-model="addProduct.Product_name"
                  standout="bg-primary text-white"
                  type="text"
                  label="ProductName"
                />
                <q-input
                  v-model="addProduct.Product_price"
                  standout="bg-primary text-white"
                  type="text"
                  label="ProductPrice"
                />
                <q-input
                  v-model="addProduct.Inventory"
                  standout="bg-primary text-white"
                  type="text"
                  label="Inventory"
                />
                <q-input
                  v-model="addProduct.Supplier"
                  standout="bg-primary text-white"
                  type="text"
                  label="Supplier"
                />
                <q-input
                  v-model="addProduct.Category"
                  standout="bg-primary text-white"
                  type="text"
                  label="Category"
                />
              </div>

              <q-btn
                label="Create Product"
                icon="add"
                class="full-width"
                color="primary"
                @click="AddNewProduct"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<style>
.Form .on-left {
  margin-right: 2px;
}
.confirmDelete .on-left {
  margin-right: 2px;
}
</style>
