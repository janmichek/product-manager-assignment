<script setup lang="ts">
import { QInput, QIcon } from 'quasar'

const model = defineModel<string>()
</script>

<template>
  <q-input v-model="model">
    <template v-slot:prepend>
      <q-icon name="search"/>
    </template>
  </q-input>
</template>

