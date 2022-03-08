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
        const cartItemIndex = store.state.cart.findIndex(item => item.pid === chosenItem.pid);
        const productIndex = store.state.products.findIndex(item => item.pid === chosenItem.pid);
        if (cartItemIndex < 0 ) {
            console.error("Item not found");
            return;
        }
        if (chosenItem.quantity === 0) {
            if (confirm(`Are you sure you want to remove this from your cart?\n    ${findItem(chosenItem).name}`)) {
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
        return 'Shopping List (Total: $' + store.state.cart.reduce((prev, curr) => prev + findItem(curr).price * curr.quantity, 0).toFixed(2) + ')';
    });

    const findItem = (item) => {
        return store.state.products.find(i => i.pid === item.pid);
        // return {
        //     name: "Test",
        //     quantity: 1,
        //     price: 2.3
        // }
    }

</script>

<template>
    <div @mouseover="showCart" @mouseleave="hideCart">
        <i id="cart-icon" class="bi bi-cart icon"></i>
        <!-- shopping list -->
        <div class="container-fluid shopping-list" v-if="store.state.showCart">
            <title id="shopping-list-title" class="row">{{ title }}</title>
            <table>
                <tr v-for="item in store.state.cart" :key="item.pid">
                    <td class="col m-2">{{ findItem(item).name }}</td>
                    <td>Qty: <input class="col m-2 w-50" type="number" min="0" v-model.number="item.quantity" @focus="updateOldValue(item.quantity)" @change="handleQuantityChange(item)"></td>
                    <td class="col m-2" id="shopping-list-item-price">${{ findItem(item).price }}</td>
                </tr>
            </table>
            <div class="row" id="checkout-button">
                <button class="btn btn-secondary w-50" type="submit" @click="checkout()">Checkout</button>
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
    overflow-y: scroll;
}

#shopping-list-title {
    font-weight: bold;
    padding-left: 10px;
}

</style>