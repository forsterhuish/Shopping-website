<script setup>
    import ShoppingList from '@/components/ShoppingList.vue';
    import { useStore } from 'vuex';
    import { RouterLink, useRouter } from 'vue-router';
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    const store = useStore();
    const router = useRouter();
    const brand = "IERG4210 Shopping Site"; // shop brand
    const handlePageChange = (pageIndex) => {
        store.commit('hideProductDetails'); // hide the product details section
        store.commit('updateProductID', -1); // update current product ID
        store.commit('updateCatID', pageIndex); // update current page ID
    }
    const logout = async () => {
        if (confirm("Are you sure you want to logout? ")) {
            handlePageChange(0);
            const res = await fetch('/admin/user_mgnt.php?action=logout', { credentials: 'same-origin' });
            const res_text = await res.text();
            const res_json = JSON.parse(res_text.split(";")[1])
            // console.log(res_json);
    
            if (res_json['success'] === true) {
                store.commit('setCurrentUser', { name: "Guest", isAdmin: false });
                // Go to home page
                router.push('/');
            }
        }
    }

</script>

<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-expand-md navbar-light bg-light">
            <div class="container-fluid">
                <!-- <a class="navbar-brand">{{ brand }}</a> -->
                <!-- Show collapsed menu when in small screen size only -->
                <router-link :to="{ path: '/' }" class="navbar-brand" @click="handlePageChange(0)">{{ brand }}</router-link>
                <router-link :to="{ path: '/admin-panel' }" class="nav-link link-danger" @click="handlePageChange(0)" v-show="store.state.currentUser.isAdmin === true">Admin</router-link>
                <router-link :to="{ path: '/login' }" class="nav-link link-success" @click="handlePageChange(0)" v-if="store.state.currentUser.name === 'Guest'">Login</router-link>
                <router-link :to="{ path: '/logout' }" class="nav-link" @click="logout()" v-else>Logout</router-link>
                <router-link :to="{ path: '/change-pw' }" class="nav-link" @click="handlePageChange(0)" v-show="store.state.currentUser.name !== 'Guest'">Change Password</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item" v-for="category in store.state.categories" :key="category.catid">
                            <router-link :to="{ path: `/` }" class="nav-link" :class="category.catid === store.state.currentCatID ? 'active' : ''" aria-current="page" @click="handlePageChange(category.catid)">{{ category.name }}</router-link>
                        </li>
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