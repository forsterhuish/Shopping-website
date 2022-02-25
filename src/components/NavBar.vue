<script setup>
    import ShoppingList from '@/components/ShoppingList.vue';
    import { useStore } from 'vuex';
    import { RouterLink } from 'vue-router';
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    const store = useStore();
    const brand = "IERG4210 Shopping Site"; // shop brand
    const handlePageChange = (pageIndex) => {
        store.commit('hideProductDetails'); // hide the product details section
        store.commit('updateProductID', -1); // update current product ID
        store.commit('updatePageID', pageIndex); // update current page ID
    }
</script>

<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-expand-md navbar-light bg-light">
            <div class="container-fluid">
                <!-- <a class="navbar-brand">{{ brand }}</a> -->
                <router-link :to="{ path: '/' }" class="navbar-brand">{{ brand }}</router-link>
                <router-link :to="{ path: '/admin' }" class="nav-link">Admin</router-link>
                <!-- Show collapsed menu when in small screen size only -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item" v-for="(category, index) in store.state.categories" :key="index">
                            <router-link :to="{ path: `/${category}` }" class="nav-link" :class="index === store.state.currentPageID ? 'active' : ''" aria-current="page" @click="handlePageChange(index)">{{ category }}</router-link>
                        </li>
                        <!-- Search Bar -->
                        <!-- <li class="nav-item">
                            <form class="d-flex">
                                <input class="form-control m-2" type="search" placeholder="Search" aria-label="Search">
                                <button class="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </li> -->
                    </ul>
                </div>
                <!-- Cart -->
                <ShoppingList />
            </div>
        </nav>
    </header>
</template>

<style scoped>

</style>