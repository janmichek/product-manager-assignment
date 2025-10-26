<script setup lang="ts">
import { computed } from 'vue'
import { QTable, QTr, QTd, QBadge, QBtn } from 'quasar'
import type { Category } from '@/types'
import type { QTableProps } from 'quasar'

const props = defineProps<{categories: Category[]}> ()

const emit = defineEmits<{
  'row-clicked': [category: Category]
  'edit-clicked': [category: Category]
  'delete-clicked': [category: Category]
}>()

const rows = computed(() => props.categories)

const columns: QTableProps['columns'] = [
  { name: 'icon', label: 'Icon', field: 'icon', align: 'center', sortable: false },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'schema', label: 'Attributes', field: 'schema', align: 'left', sortable: false },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right', sortable: false }
]
</script>

<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    flat
    :rows-per-page-options="[0]">
    <template v-slot:no-data>
      No categories found.
    </template>

    <template v-slot:body="props">
      <q-tr
        :props="props"
        @click="emit('row-clicked', props.row)"
        class="cursor-pointer">
        <q-td
          key="icon"
          :props="props">
          <q-badge
            class="w-11 h-11 flex items-center justify-center"
            :style="{backgroundColor: props.row.color}">
            {{ props.row.icon }}
          </q-badge>
        </q-td>

        <q-td
          key="name"
          :props="props">
          {{ props.row.name }}
        </q-td>

        <q-td
          key="schema"
          :props="props">
          <template v-if="props.row.schema && props.row.schema.length > 0">
            <div
              v-for="field in props.row.schema"
              :key="field.key">
              <strong>{{ field.label }}</strong>({{ field.key }})
              <q-badge
                color="grey-8"
                :label="field.type"/>
              <q-badge
                v-if="field.required"
                color="red-3"
                label="required"
                class="q-ml-xs"/>
            </div>
          </template>
          <template v-else>No attributes</template>
        </q-td>

        <q-td
          key="actions"
          :props="props">
          <q-btn
            color="primary"
            icon="edit"
            flat
            @click.stop="emit('edit-clicked', props.row)">
          </q-btn>
          <q-btn
            color="negative"
            icon="delete"
            flat
            @click.stop="emit('delete-clicked', props.row)">
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
