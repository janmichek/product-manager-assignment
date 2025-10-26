<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QDialog, QCard, QBar, QCardSection, QCardActions, QInput, QBtn, QSpace } from 'quasar'
import type { AttributeDefinition, Category } from '@/types'
import CategoryFormAttributesSection from '@/components/CategoryFormAttributesSection.vue'

const props = defineProps<{
  modelValue: boolean
  category: Category | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [category: Category]
  cancel: []
}>()

const isEditMode = computed(() => !!props.category)

const title = computed(() =>
  props.category ? 'Edit Category' : 'Create Category'
)

const defaultCategoryData = () => ({
  id: '',
  name: '',
  icon: '',
  color: '',
  schema: [] as AttributeDefinition[]
})

const formData = ref(defaultCategoryData())

// Watch for category prop changes for edit mode
watch(() => props.category, newCategory => {
  if (newCategory) {
    formData.value = {
      id: newCategory.id,
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color,
      schema: newCategory.schema.map(field => (
        {
          ...field,
          options: field.options || []
        }
      ))
    }
  }
}, { immediate: true })

// Reset form when dialog closes
watch(() => props.modelValue, isOpen => {
  if (!isOpen && !isEditMode.value) {
    formData.value = defaultCategoryData()
  }
})

function addSchemaField() {
  formData.value.schema.push({
    key: '',
    label: '',
    type: 'text',
    required: false,
    options: []
  })
}

function removeSchemaField(index: number) {
  formData.value.schema.splice(index, 1)
}

function addOption(schemaIndex: number) {
  const field = formData.value.schema[schemaIndex]
  if (field) {
    if (!field.options) {
      field.options = []
    }
    field.options.push('')
  }
}

function removeOption(schemaIndex: number, optionIndex: number) {
  const field = formData.value.schema[schemaIndex]
  if (field && field.options) {
    field.options.splice(optionIndex, 1)
  }
}

function submit() {
  const { id, name, icon, color, schema } = formData.value
  const processedSchema: AttributeDefinition[] = schema.map(field => {
    const { options: _options, ...baseField } = field
    if (field.type === 'select') {
      return { ...baseField, options: field.options }
    }
    return baseField
  })

  const newCategory = {
    ...(isEditMode.value && { id }),
    name,
    icon,
    color,
    schema: processedSchema
  }

  emit('submit', newCategory as Category)
}

function close() {
  emit('cancel')
}
</script>

<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)">
    <q-card>
      <q-bar class="bg-primary text-white">
        {{ title }}
        <q-space/>
        <q-btn
          flat
          icon="close"
          @click="close"/>
      </q-bar>

      <form @submit.prevent="submit">
        <q-card-section>
          <q-input
            v-model="formData.name"
            label="Name *"
            :rules="[val => !!val]">
          </q-input>

          <q-input
            v-model="formData.icon"
            label="Icon *"
            :rules="[val => !!val]">
          </q-input>

          <q-input
            v-model="formData.color"
            label="Color *"
            :rules="[val => !!val]">
          </q-input>

          <category-form-attributes-section
            :schema="formData.schema"
            @add-schema-field="addSchemaField"
            @remove-schema-field="removeSchemaField"
            @add-option="addOption"
            @remove-option="removeOption"/>
        </q-card-section>

        <slot name="actions">
          <q-card-actions align="right">
            <q-btn
              flat
              type="button"
              label="Cancel"
              @click="close"/>
            <q-btn
              type="submit"
              color="positive"
              :label="isEditMode ? 'Update Category' : 'Create Category'"/>
          </q-card-actions>
        </slot>
      </form>
    </q-card>
  </q-dialog>
</template>
