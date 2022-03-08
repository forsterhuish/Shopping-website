<script setup>
    import Products from "@/components/Products.vue";
    import ProductDetail from "@/components/ProductDetail.vue";
    import { useStore } from 'vuex';
    const store = useStore();
    let currentProduct = {};
    const addToCart = (product) => {
        const productIndex = store.state.products.findIndex(item => item.pid === product.pid);
        const newItem = {
            pid: product.pid,
            quantity: 1,
        };
        // store.commit('updateInventory', { productIndex: productIndex, updateValue: -1 });
        store.commit('addItemToCart', newItem);
    };
    const viewDetails = (product) => {
        Object.assign(currentProduct, product);
        store.commit('updateProductID', product.pid);
        store.commit('showProductDetails');
    };
    const displayImage = async (product) => {
        let prod_url = ""
        return prod_url !== "" ? prod_url : 
            (product.catid === store.state.categories[0].catid
                ? '/admin/lib/images/food.jpeg'
                : '/admin/lib/images/beverages.jpeg'
            );
    };
</script>

<template>
    <Products v-if="!(store.state.showProductDetails)" @add-to-cart="addToCart" @show-product-details="viewDetails"/>
    <ProductDetail v-else :product="currentProduct" @add-to-cart="addToCart"/>
</template>