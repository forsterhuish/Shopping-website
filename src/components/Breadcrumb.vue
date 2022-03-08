<script setup>
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    import { useStore } from 'vuex';
    import { RouterLink } from 'vue-router';
    const store = useStore();
    const currentProductBreadcrumb = () => {
        return store.state.currentProductID > 0 ? store.state.products.find(item => item.pid === store.state.currentProductID).name : '';
    }
    
    const activeBreadcrumb = (index) => {
        // Determine whether the breadcrumb should be active
        return index === store.state.currentCatID && store.state.currentProductID < 0;
    }

    const navigatePage = (index) => {
        store.commit('updateProductID', -1);
        store.commit('updateCatID', index);
        store.commit('hideProductDetails');
    }
</script>

<template>
    <nav class="page-breadcrumb" aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link :to="{path: `/`}" @click="navigatePage(0)">Home</router-link></li>
            <li v-for="category in store.state.categories" :key="category.catid" 
                v-show="category.catid === store.state.currentCatID" class="breadcrumb-item" 
                :class="activeBreadcrumb(category.catid) ? 'active' : ''" aria-current="page"
            >
                <router-link :to="{path: `/`}" @click="navigatePage(category.catid)" v-if="store.state.currentProductID >= 0">{{ category.name }}</router-link>
                <span v-else>{{ category.name }}</span>
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