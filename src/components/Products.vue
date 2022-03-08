<script setup>
    import { computed, onBeforeMount } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router'
    import ProductDetail from '@/components/ProductDetail.vue'
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    const store = useStore();
    const emit = defineEmits(['add-to-cart', 'show-product-details']);

    const currentPage = computed(() => {
        // Return name of selected category
        return store.state.categories[store.state.currentCatID];
    });
    const displayImage = (product) => {
        let prod_url = ""
        return prod_url !== "" ? prod_url : 
            (product.catid === store.state.categories[0].catid
                ? '/admin/lib/images/food.jpeg'
                : '/admin/lib/images/beverages.jpeg'
            );
    };
    const addToCart = (product) => {
        emit('add-to-cart', product);
    };
    const viewDetails = (product) => {
        emit('show-product-details', product);
    };
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-md-4 col-sm-6 thumbnail" v-for="product in store.state.products" :key="product.pid" v-show="store.state.currentCatID > 0 && product.catid === store.state.currentCatID">
                <a href="#" @click='viewDetails(product)'>
                    <img class="product-thumbnail" :alt="product.name" :src="displayImage(product)"> <!-- Product Thumbnail -->
                </a>
                <a href="#" @click='viewDetails(product)'>
                    <p class="product-name">{{ product.name }}</p> <!-- Product Name -->
                </a>
                <p class="product-price">${{ product.price }}</p> <!-- Product Price -->
                <button class="btn btn-primary add-to-cart-button" :class="product.stock && product.stock < 0 ? 'disabled' : ''" @click="addToCart(product)">Add To Cart</button>
            </div>
            <h1 v-show="store.state.currentCatID === 0">This is the home page</h1>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/base.css';
.thumbnail {
    width: 250px;
    margin-bottom: 5px;
}

.product-thumbnail {
    max-height: 230px;
    max-width: 230px;
}

.product-name {
    display: inline;
    width: 100px;
    font-size: 15px;
    color: #ea00ff;
    margin-right: 4px;
}

.product-price {
    display: inline;
    font-size: 11px;
    color: #f89c5f;
    margin: 0;
}
</style>
<style>
.add-to-cart-button {
    display: block;
    margin-top: 5px;
}
</style>