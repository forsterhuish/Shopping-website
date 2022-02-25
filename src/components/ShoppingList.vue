<script setup>
    import { computed } from 'vue';
    import { useStore } from 'vuex';
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    // Bootstrap Icon
    import "bootstrap-icons/font/bootstrap-icons.css";
    const store = useStore();
    let oldValue = 0;
    const showCart = () => {
        store.state.showCart = true;
    }
    const hideCart = () => {
        store.state.showCart = false;
    }
    const handleQuantityChange = (chosenItem) => {
        const cartItemIndex = store.state.cart.findIndex(item => item.id === chosenItem.id);
        const productIndex = store.state.products.findIndex(item => item.id === chosenItem.id);
        if (cartItemIndex < 0 ) {
            console.error("Item not found");
            return;
        }
        if (chosenItem.quantity === 0) {
            if (confirm(`Are you sure you want to remove this from your cart?\n    ${chosenItem.name}`)) {
                // Remove item from cart
                // store.commit('updateInventory', { productIndex: productIndex, updateValue: 1 })
                store.commit('removeItemFromCart', cartItemIndex);
            }
            else {
                // Cancel the removing of item
                store.commit('updateCartItemQuantity', { chosenItemIndex: cartItemIndex, newValue: chosenItem.quantity + 1 });
            }
        }
        else {
            const updateValue = oldValue - chosenItem.quantity; // the difference in quantity
            // store.commit('updateInventory', { productIndex: productIndex, updateValue: updateValue });
            store.commit('updateCartItemQuantity', { chosenItemIndex: cartItemIndex, newValue: chosenItem.quantity });
        }
    }
    const checkout = () => {
        console.log("checkout");
    }
    const updateOldValue = (value) => {
        oldValue = value;
    }
    const title = computed(() => {
        return 'Shopping List (Total: $' + store.state.cart.reduce((prev, { price, quantity }) => prev + price * quantity, 0) + ')';
    });
</script>

<template>
    <div @mouseover="showCart" @mouseleave="hideCart">
        <i id="cart-icon" class="bi bi-cart icon"></i>
        <!-- shopping list -->
        <div class="container shopping-list" v-if="store.state.showCart">
            <title id="shopping-list-title" class="row align-items-start">{{ title }}</title>
            <ul class="row align-items-center shopping-list-item" v-for="item in store.state.cart" :key="item.id">
                <li id="shopping-list-item-name" class="col-7">{{ item.name }}</li>
                Qty: 
                <input class="col-2" type="number" min="0" v-model.number="item.quantity" @focus="updateOldValue(item.quantity)" @change="handleQuantityChange(item)">
                <li id="shopping-list-item-price" class="col-2">@${{ item.price }}</li>
            </ul>
            <div class="row align-items-end" id="checkout-button">
                <button class="btn btn-secondary col-5" type="submit" @click="checkout()">Checkout</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/base.css';
.icon {
    font-size: 25px;
    transition: transform 1s;
}

.icon:hover {
    transform: scale(1.2); /* increase by 120% */
}

#cart {
    font-size: 2.5rem;
}

.shopping-list {
    background-color: #e7e6e6;
    box-shadow: 1px 1px 2px #cccccc;
    position: fixed;
    z-index: 1;
    top: 25px;
    right: 0;
    width: min(550px, 55vw);
    height: min(300px, 75vh);
    padding: min(5%, 15px);
    margin: min(5%, 15px);
    border-radius: 5%;
    /* display: flex; */
    /* justify-content: space-around; */
}

#shopping-list-title {
    font-weight: bold;
    padding-left: 10px;
}

.shopping-list-item {
    padding: 5px;
    margin: 5px;
}
</style>