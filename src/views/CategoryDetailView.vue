<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { useQuasar, QSpinner, QBanner, QBtn } from 'quasar'
import { productsByCategoryQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '@/queries/products'
import { categoryDetailQuery } from '@/queries/categories'
import CategoryDetailCard from '@/components/CategoryDetailCard.vue'
import ProductFormDialog from '@/components/ProductFormDialog.vue'
import ProductSearchInput from '@/components/ProductSearchInput.vue'
import ProductTable from '@/components/ProductTable.vue'
import type { Product, Category } from '@/types'

const route = useRoute()
const $q = useQuasar()

const isDialogOpen = ref(false)
const categoryId = computed(() => route.params.id as string)
const selectedProduct = ref<Product | null>(null)
const searchQuery = ref('')

const {
  state: categoryState,
  asyncStatus: categoryAsyncStatus
} = useQuery(() => categoryDetailQuery(categoryId.value))

const {
  state: productsState,
  asyncStatus: productsAsyncStatus
} = useQuery(() => productsByCategoryQuery(categoryId.value))

const category = computed<Category | null>(() => categoryState.value.data || null)

const products = computed<Product[]>(() => productsState.value.data || [])

const loading = computed(() => categoryAsyncStatus.value === 'loading' || productsAsyncStatus.value === 'loading')

const error = computed(() => {
  if (categoryState.value.status === 'error') return 'Failed to load category'
  if (productsState.value.status === 'error') return 'Failed to load products'
  return null
})


const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return products.value
  }

  const query = searchQuery.value.toLowerCase().trim()

  return products.value.filter(product => {
    if (product.name.toLowerCase().includes(query)) {
      return true
    }

    if (String(product.price).includes(query)) {
      return true
    }

    if (String(product.stock).includes(query)) {
      return true
    }

    if (hasAttributeMatch(product.attributes, query)) {
      return true
    }

    return false
  })
})

function hasAttributeMatch(attributes: Record<string, string | number | boolean>, query: string) {
  for (const [key, value] of Object.entries(attributes)) {
    const stringValue = String(value).toLowerCase()
    if (stringValue.includes(query) || key.toLowerCase().includes(query)) {
      return true
    }
  }
}

function openCreateModal() {
  selectedProduct.value = null
  isDialogOpen.value = true
}

function openEditModal(product: Product) {
  selectedProduct.value = product
  isDialogOpen.value = true
}

function closeModal() {
  isDialogOpen.value = false
  selectedProduct.value = null
}

async function submit(product: Product) {
  const isEditMode = !!selectedProduct.value
  try {
    if (isEditMode) {
      await useUpdateProductMutation().mutateAsync(product)
      $q.notify({
        type: 'positive',
        message: `Product "${product.name}" updated successfully!`,
      })
    } else {
      await useCreateProductMutation().mutateAsync(product)
      $q.notify({
        type: 'positive',
        message: `Product "${product.name}" added successfully!`,
      })
    }
    closeModal()
  } catch {
    $q.notify({
      type: 'negative',
      message: `Failed to ${selectedProduct.value ? 'update' : 'add'} product.`,
    })
  }
}

async function deleteProduct(product: Product) {
  $q.dialog({message: `Are you sure you want to delete the product "${product.name}"?`,})
    .onOk(async () => {
      try {
        await useDeleteProductMutation().mutateAsync(product.id)
        $q.notify({
          type: 'positive',
          message: `Product "${product.name}" deleted successfully!`,
        })
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to delete product.',
        })
      }
    })
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-5 py-5">
    <div
      v-if="loading"
      class="flex justify-center py-15">
      <q-spinner
        color="positive"
        size="100px"/>
    </div>

    <q-banner
      v-else-if="error"
      class="bg-negative">
      {{ error }}
    </q-banner>

    <div v-else-if="!loading && category">
      <div class="mb-10">
        <category-detail-card :category="category"/>
      </div>

      <div class="mt-5">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-gray-600 m-0">Products in {{ category.name }}</h2>
          <q-btn
            color="positive"
            @click="openCreateModal">
            + Create Product
          </q-btn>
        </div>

        <product-search-input v-model="searchQuery"/>

        <product-table
          :products="filteredProducts"
          @edit-clicked="openEditModal"
          @delete-clicked="deleteProduct"/>
      </div>
    </div>

    <q-banner
      v-if="!loading && !category"
      class="bg-warning text-white"
      rounded>
      <div>Category not found.</div>
    </q-banner>

    <product-form-dialog
      :is-open="isDialogOpen"
      @update:is-open="isDialogOpen = $event"
      :category-id="categoryId"
      :product="selectedProduct"
      @submit="submit"
      @cancel="closeModal"/>
  </div>
</template>
