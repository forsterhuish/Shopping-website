<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeMount } from '@vue/runtime-core';
import { useStore } from 'vuex';
const store = useStore();
onBeforeMount(async () => {
  // Need to mount categories & products before running
  const cat = await fetch(`/admin/cat.php`);
  const categories = await cat.json();
  store.commit('loadCategories', categories);
  const prod = await fetch('admin/prod.php');
  const products = await prod.json();
  store.commit('loadProducts', products);
});
</script>

<template>
  <RouterView />
</template>

<style>

</style>
