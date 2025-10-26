<script setup lang="ts">
import type { Category } from '@/types'
import {QBtn, QBadge} from 'quasar'

defineProps<{
  category: Category
}>()
</script>

<template>
  <q-btn
    to="/categories"
    flat
    size="xs">
    ← Back to Categories
  </q-btn>
  <div class="flex items-center gap-lg q-mt-md">
    <q-badge
      class="flex items-center justify-center w-20 h-20 q-mr-sm text-h6"
      :style="{backgroundColor: category.color}">
      {{ category.icon }}
    </q-badge>

    <h2>{{ category.name }}</h2>
  </div>
</template>
