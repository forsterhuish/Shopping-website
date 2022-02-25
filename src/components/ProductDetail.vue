<script setup>
    import { computed, defineProps, defineEmits } from 'vue';
    import { useStore } from 'vuex';
    const store = useStore();
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    const props = defineProps({
        product: {
            type: Object,
            required: true,
        },
    });
    const emit = defineEmits(['add-to-cart', 'display-image']);
    const displayImage = (product) => {
        return product.category === "Food"
            ? "/images/food.jpeg"
            : "/images/beverages.jpeg";
    };
    const addToCart = (product) => {
        emit("add-to-cart", product);
    };
    const currentInventory = computed(() => {
        return store.state.products.find((item) => item.name === props.product.name).inventory;
    });
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <img class="product-image-large" :src="displayImage(props.product)">
            </div>
            <div class="col">
                <p class="product-detail-name">{{ props.product.name }}</p>
                <p class="product-detail-price">${{ props.product.price }}</p>
                <p class="product-detail-inventory">Inventory: {{ currentInventory }}</p>
                <section>
                    <!-- Description -->
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco la
                        boris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in vol
                        uptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </section>
                <button class="btn btn-primary add-to-cart-button" @click="addToCart(props.product)">Add To Cart</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/base.css';
.product-image-large {
    max-height: 530px;
    max-width: 530px;
}

.product-detail-name {
    font-size: 25px;
    color: #ea00ff;
}

.product-detail-price {
    font-size: 18px;
    color: #f89c5f;
}

.product-detail-inventory {
    font-size: 20px;
    color: blueviolet;
}
</style>