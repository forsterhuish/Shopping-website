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
                store.commit('setCurrentUser', { name: "Guest", isAdmin: false, logon: false });
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
                <!-- Show collapsed menu when in small screen size only -->
                <router-link :to="{ path: '/' }" class="navbar-brand" @click="handlePageChange(0)">{{ brand }}</router-link>
                <router-link :to="{ path: '/login' }" class="nav-link link-success" @click="handlePageChange(0)" v-if="store.state.currentUser.logon === false">Login</router-link>
                <router-link :to="{ path: '/logout' }" class="nav-link" @click="logout()" v-else>Logout</router-link>
                <ul class="navbar-nav" v-show="store.state.currentUser.logon === true">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            User Actions
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <li>
                                <router-link :to="{ path: '/admin-panel' }" class="dropdown-item link-danger" @click="handlePageChange(0)" v-show="store.state.currentUser.isAdmin === true">Admin</router-link>
                            </li>
                            <li>
                                <router-link :to="{ path: '/change-pw' }" class="dropdown-item" @click="handlePageChange(0)" v-show="store.state.currentUser.logon === true">Change Password</router-link>
                            </li>
                            <li>
                                <router-link :to="{ path: '/orderhist' }" class="dropdown-item" @click="handlePageChange(0)" v-show="store.state.currentUser.logon === true">Order History</router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
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
                <ShoppingList/>
            </div>
        </nav>
    </header>
</template>

<style scoped>

</style>