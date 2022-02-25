<script setup>
    import Products from "@/components/Products.vue";
    import ProductDetail from "@/components/ProductDetail.vue";
    import { useStore } from 'vuex';
    const store = useStore();
    let currentProduct = {};
    const addToCart = (product) => {
        const productIndex = store.state.products.findIndex(item => item.id === product.id);
        const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
        };
        // store.commit('updateInventory', { productIndex: productIndex, updateValue: -1 });
        store.commit('addItemToCart', newItem);
    };
    const viewDetails = (product) => {
        Object.assign(currentProduct, product);
        store.commit('updateProductID', product.id);
        store.commit('showProductDetails');
    };
    // const displayImage = (product) => {
    //     return product.category === store.state.categories[0]
    //         ? "../assets/images/food.jpeg"
    //         : "../assets/images/beverage.jpeg";
    // };
</script>

<template>
    <Products v-if="!(store.state.showProductDetails)" @add-to-cart="addToCart" @show-product-details="viewDetails"/>
    <ProductDetail v-else :product="currentProduct" @add-to-cart="addToCart"/>
</template>