<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import NavBar from '@/components/NavBar.vue'
import ProductView from '@/views/ProductView.vue'
import { RouterView } from 'vue-router';
</script>

<template>
  <main>
    <NavBar />
    <Breadcrumb />
    <ProductView />
  </main>
</template>
