<script setup>
    import { computed } from 'vue';
    import { useStore } from 'vuex';
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    const store = useStore();
    // Bootstrap
    const props = defineProps({
        product: {
            type: Object,
            required: true,
        },
    });
    const emit = defineEmits(['add-to-cart', 'display-image']);
    const displayImage = (product) => {
        let prod_url = ""
        return prod_url !== "" ? prod_url : 
            (product.catid === store.state.categories[0].catid
                ? '/admin/lib/images/food.jpeg'
                : '/admin/lib/images/beverages.jpeg'
            );
    };
    const addToCart = (product) => {
        emit("add-to-cart", product);
    };
    const currentInventory = computed(() => {
        return store.state.products.find((item) => item.pid === props.product.pid).stock;
    });
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <img class="product-image-large" :src="displayImage(props.product)" :alt="product.name">
            </div>
            <div class="col">
                <p class="product-detail-name">{{ props.product.name }}</p>
                <p class="product-detail-price">${{ props.product.price }}</p>
                <p class="product-detail-inventory">Inventory: {{ currentInventory }}</p>
                <section>
                    <p>
                        {{ props.product.description }}
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