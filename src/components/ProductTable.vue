<script setup lang="ts">
import {computed} from 'vue'
import {QTable, QTd, QBtn} from 'quasar'
import type {Product} from '@/types'
import type {QTableProps} from 'quasar'
const props = defineProps<{products: Product[]}>()

const emit = defineEmits<{
  'edit-clicked': [product: Product]
  'delete-clicked': [product: Product]
}>()

const rows = computed(() => props.products)

const attributeKeys = computed(() => {
  const keys = new Set<string>()
  props.products.forEach(product => {
    if (product.attributes) {
      Object.keys(product.attributes).forEach(key => keys.add(key))
    }
  })
  return Array.from(keys)
})

const columns = computed<QTableProps['columns']>(() => {
  const baseColumns: QTableProps['columns'] = [
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    { name: 'price', label: 'Price', field: 'price', sortable: true },
    { name: 'stock', label: 'Stock', field: 'stock', sortable: true },
  ]

  const customColumns: QTableProps['columns'] =
    attributeKeys.value.map(key => ({
      name: key, label: key, field: key, sortable: false
    }))

  return [
    ...baseColumns,
    ...customColumns,
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
  ]
})
</script>

<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    flat
    :rows-per-page-options="[0]">
    <!--    BASE COLUMNS HERE-->
    <template
      v-for="key in attributeKeys"
      :key="key"
      #[`body-cell-${key}`]="props">
      <q-td :props="props">
        {{ props.row.attributes[key] }}
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          color="primary"
          icon="edit"
          flat
          @click="emit('edit-clicked', props.row)">
        </q-btn>
        <q-btn
          color="negative"
          icon="delete"
          flat
          @click="emit('delete-clicked', props.row)">
        </q-btn>
      </q-td>
    </template>

    <template v-slot:no-data>
      No products found.
    </template>
  </q-table>
</template>
