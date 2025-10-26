<script setup lang="ts">
import { QInput, QSelect, QToggle } from 'quasar'
import type { Category } from '@/types'

const props = defineProps<{
  category: Category
  attributes: Record<string, string | number | boolean>
}>()

const emit = defineEmits<{
  'update:attributes': [value: Record<string, string | number | boolean>]
}>()

const updateAttribute = (key: string, value: string | number | boolean) => {
  emit('update:attributes', {
    ...props.attributes,
    [key]: value
  })
}
</script>
<template>
  <div>
    <div
      v-for="field in category.schema"
      :key="field.key">
      <template v-if="field.type === 'text'">
        <q-input
          :model-value="String(attributes[field.key] || '')"
          @update:model-value="updateAttribute(field.key, $event || '')"
          :label="`${field.label}${field.required ? ' *' : ''}`"
          :rules="field.required ? [val => !!val] : []"/>
      </template>

      <template v-if="field.type === 'number'">
        <q-input
          :model-value="String(attributes[field.key] || '')"
          @update:model-value="updateAttribute(field.key, isNaN(Number($event)) ? 0 : Number($event))"
          :label="`${field.label}${field.required ? ' *' : ''}`"
          type="number"
          :rules="field.required ? [val => !!val]  : []"/>
      </template>

      <template v-if="field.type === 'boolean'">
        <q-toggle
          :model-value="attributes[field.key]"
          @update:model-value="updateAttribute(field.key, $event)"
          :label="`${field.label}${field.required ? ' *' : ''}`"/>
      </template>

      <template v-if="field.type === 'select'">
        <q-select
          :model-value="attributes[field.key]"
          @update:model-value="updateAttribute(field.key, $event)"
          :label="`${field.label}${field.required ? ' *' : ''}`"
          :options="field.options"
          :rules="field.required ? [val => !!val] : []"/>
      </template>

      <template v-if="field.type === 'date'">
        <q-input
          :model-value="String(attributes[field.key] || '')"
          @update:model-value="updateAttribute(field.key, $event || '')"
          :label="`${field.label}${field.required ? ' *' : ''}`"
          type="date"
          :rules="field.required ? [val => !!val] : []"/>
      </template>
    </div>
  </div>
</template>
