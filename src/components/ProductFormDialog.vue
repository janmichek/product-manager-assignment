<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuery } from '@pinia/colada'
import { QDialog, QCard, QBar, QCardSection, QCardActions, QInput, QBtn, QSpace } from 'quasar'
import { categoryDetailQuery } from '@/queries/categories'
import type { Category, Product } from '@/types'
import ProductFormCustomSection from '@/components/ProductFormCustomSection.vue'

const props = defineProps<{
  isOpen: boolean
  categoryId: string
  product: Product | null
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  submit: [product: Product]
  cancel: []
}>()

const { state: categoryState } = useQuery(() => categoryDetailQuery(props.categoryId))
const category = computed<Category | null>(() => categoryState.value.data || null)

const isEditMode = computed(() => !!props.product)

const title = computed(() =>
  props.product ? 'Edit Product' : 'Create Product'
)

const formData = ref({
  id: '',
  name: '',
  categoryId: props.categoryId,
  price: 0,
  stock: 0,
  attributes: {} as Record<string, string | number | boolean>,
})

// for edit mode
watch(() => props.product, newProduct => {
  if (newProduct) {
    formData.value = newProduct
  }
}, { immediate: true })

const submit = () => {
  const product: Product = formData.value
  emit('submit', product)

  if (!isEditMode.value) {
    cancel()
  }
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <q-dialog :model-value="isOpen">
    <q-card>
      <q-bar class="bg-primary text-white">
        {{ title }}
        <q-space/>
        <q-btn
          flat
          icon="close"
          @click="cancel"/>
      </q-bar>

      <form @submit.prevent="submit">
        <q-card-section>
          <q-input
            v-model="formData.name"
            label="Product Name *"
            :rules="[val => !!val]"/>

          <q-input
            v-model.number="formData.price"
            label="Price *"
            type="number"
            :rules="[val => !!val]"/>

          <q-input
            v-model.number="formData.stock"
            label="Stock *"
            type="number"
            :rules="[val => !!val]"/>

          <product-form-custom-section
            v-if="category"
            :category="category"
            :attributes="formData.attributes"
            @update:attributes="formData.attributes = $event"/>
        </q-card-section>

        <slot name="actions">
          <q-card-actions align="right">
            <q-btn
              flat
              type="button"
              label="Cancel"
              @click="cancel"/>
            <q-btn
              type="submit"
              color="positive"
              :label="isEditMode ? 'Update Product' : 'Create Product'"/>
          </q-card-actions>
        </slot>
      </form>
    </q-card>
  </q-dialog>
</template>
