<script setup>
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    import { useStore } from 'vuex';
    import { RouterLink } from 'vue-router';
    const store = useStore();
    const currentProductBreadcrumb = () => {
        return store.state.currentProductID > 0 ? store.state.products.find(item => item.id === store.state.currentProductID).name : '';
    }
    
    const activeBreadcrumb = (index) => {
        // Determine whether the breadcrumb should be active
        return index === store.state.currentPageID && store.state.currentProductID < 0;
    }

    const navigatePage = (index) => {
        store.commit('updateProductID', -1);
        store.commit('updatePageID', index);
        store.commit('hideProductDetails');
    }
</script>

<template>
    <nav class="page-breadcrumb" aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link :to="{path: `/`}" @click="navigatePage(0)">Home</router-link></li>
            <li v-for="(category, index) in store.state.categories" :key="index" 
                v-show="index === store.state.currentPageID" class="breadcrumb-item" 
                :class="activeBreadcrumb(index) ? 'active' : ''" aria-current="page"
            >
                <router-link :to="{path: `/${category}`}" @click="navigatePage(index)" v-if="store.state.currentProductID >= 0">{{ category }}</router-link>
                <span v-else>{{ category }}</span>
            </li>
            <li class="breadcrumb-item active" v-show="store.state.currentProductID >= 0">{{ currentProductBreadcrumb() }}</li>
        </ol>
    </nav>
</template>

<style scoped>
@import '@/assets/base.css';
.page-breadcrumb {
    --bs-breadcrumb-divider: '/';
    margin-left: 1.75rem;
    margin-top: 1rem;
}
</style>