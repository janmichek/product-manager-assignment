<script setup lang="ts">
import { QInput, QSelect, QBtn, QCheckbox, QCard } from 'quasar'
import type { AttributeDefinition } from '@/types'

defineProps<{
  schema: AttributeDefinition[]
}>()

defineEmits<{
  'add-schema-field': []
  'remove-schema-field': [index: number]
  'add-option': [schemaIndex: number]
  'remove-option': [schemaIndex: number, optionIndex: number]
}>()
</script>

<template>
  <div class="form-section">
    <h4 class="text-h4 q-mb-sm">Custom Attributes</h4>

    <q-card
      v-for="(field, index) in schema"
      :key="index"
      class="q-mb-md q-pa-md">
      <div class="flex justify-between ">
        <span class="text-h5">Attribute {{ index + 1 }}</span>
        <q-btn
          type="button"
          flat
          color="negative"
          icon="close"
          size="sm"
          @click="$emit('remove-schema-field', index)"/>
      </div>

      <div class="schema-field-grid">
        <q-input
          v-model="field.key"
          label="Key"
          dense/>

        <q-input
          v-model="field.label"
          label="Label"
          dense/>

        <q-select
          v-model="field.type"
          label="Type"
          :options="['text', 'number', 'boolean', 'select', 'date']"
          dense/>

        <q-checkbox
          v-model="field.required"
          label="Required"
          dense/>
      </div>

      <div
        v-if="field.type === 'select'"
        class="bg-blue-grey-1 q-pa-sm q-mt-md">
        <div class="text-h6">
          Options
        </div>
        <div
          v-for="(_option, optIndex) in field.options"
          :key="optIndex">
          <q-input
            v-model="field.options![optIndex]"
            dense>
            <template v-slot:append>
              <q-btn
                type="button"
                flat
                color="negative"
                icon="close"
                size="xs"
                @click="$emit('remove-option', index, optIndex)"/>
            </template>
          </q-input>
        </div>
        <q-btn
          type="button"
          size="xs"
          class="full-width"
          @click="$emit('add-option', index)">
          + Add Option
        </q-btn>
      </div>
    </q-card>


    <q-btn
      type="button"
      color="secondary"
      @click="$emit('add-schema-field')"
      class="full-width q-mb-md">
      + Add Custom Attribute
    </q-btn>
  </div>
</template>
