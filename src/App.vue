<script setup lang="ts">
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import {QHeader, QLayout, QPageContainer, QToolbar, QToolbarTitle} from 'quasar'
</script>

<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          Product Manager
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <RouterView/>
    </q-page-container>

    <PiniaColadaDevtools/>
  </q-layout>
</template>
