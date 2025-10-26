<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { QBtn, QSpinner, QBanner } from 'quasar'
import { useQuasar } from 'quasar'
import { categoriesListQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '@/queries/categories'
import CategoryFormDialog from '@/components/CategoryFormDialog.vue'
import CategoryTable from '@/components/CategoryTable.vue'
import type { Category } from '@/types'

const router = useRouter()
const $q = useQuasar()

const isDialogOpen = ref(false)
const selectedCategory = ref<Category | null>(null)

const { state: categoriesState, asyncStatus } = useQuery(categoriesListQuery())

const categories = computed<Category[]>(() => categoriesState.value.data || [])
const loading = computed(() => asyncStatus.value === 'loading')
const error = computed(() => categoriesState.value.status === 'error' ? 'Failed to load categories' : null)

function navigateToCategory(category: Category) {
  router.push({ name: 'category-detail', params: { id: category.id } })
}

function openCreateDialog() {
  selectedCategory.value = null
  isDialogOpen.value = true
}

function openEditDialog(category: Category) {
  selectedCategory.value = category
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
  selectedCategory.value = null
}

async function submit(category: Category) {
  const isEditMode = !!selectedCategory.value
  try {
    if (isEditMode) {//
      await useUpdateCategoryMutation().mutateAsync(category)
      $q.notify({
        type: 'positive',
        message: `Category "${category.name}" updated successfully!`,
      })
    } else {
      await useCreateCategoryMutation().mutateAsync(category)
      $q.notify({
        type: 'positive',
        message: `Category "${category.name}" added successfully!`,
      })
    }
    closeDialog()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Failed to ${selectedCategory.value ? 'update' : 'create'} category. ${error}`,
    })
  }
}

async function deleteCategory(category: Category) {
  $q.dialog({message: `Are you sure you want to delete the category "${category.name}"?`})
    .onOk(async () => {
      try {
        await useDeleteCategoryMutation().mutateAsync(category.id)
        $q.notify({
          type: 'positive',
          message: `Category "${category.name}" deleted successfully!`,
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `Failed to delete category. ${error}`,
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

    <template v-else-if="!loading">
      <div class="flex justify-between items-center mb-5">
        <h2>Categories</h2>
        <q-btn
          @click="openCreateDialog"
          color="positive">
          + Create Category
        </q-btn>
      </div>

      <category-table
        :categories="categories"
        @row-clicked="navigateToCategory"
        @edit-clicked="openEditDialog"
        @delete-clicked="deleteCategory"/>
    </template>


    <category-form-dialog
      v-model="isDialogOpen"
      :category="selectedCategory"
      @submit="submit"
      @cancel="closeDialog"/>
  </div>
</template>
