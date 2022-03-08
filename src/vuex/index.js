import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            currentCatID: 0,
            categories: [],
            currentProductID: -1,
            cart: [],
            products: [],
            showProductDetails: false,
            showCart: false,
            imageURL: ""
        }
    },
    mutations: {
        updateCatID(state, index) {
            state.currentCatID = index;
        },
        updateProductID(state, index) {
            state.currentProductID = index;
        },
        showProductDetails(state) {
            state.showProductDetails = true;
        },
        // showImageURL(state, productID) {
        //     state.imageURL = `../../assets/images/${String(state.products[productID-1].category).toLowerCase()}`;
        // },
        hideProductDetails(state) {
            state.showProductDetails = false;
        },
        addItemToCart(state, newItem) {
            const itemIndex = state.cart.findIndex((item) => item.pid === newItem.pid);
            if (itemIndex >= 0)
                state.cart[itemIndex].quantity += 1;
            else
                state.cart.push(newItem);
            window.localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        removeItemFromCart(state, itemIndex) {
            state.cart.splice(itemIndex, 1);
            window.localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        updateInventory(state, { productIndex, updateValue }) {
            if (state.products[productIndex].inventory <= 0) {
                alert("Product already sold out")
                return;
            }
            else {
                state.products[productIndex].inventory += updateValue;
            }
        },
        updateCartItemQuantity(state, { chosenItemIndex, newValue }) {
            // Update quantity of specific product in shopping cart
            if (chosenItemIndex < 0) {
                console.error("cannot find item");
                return;
            }
            else {
                state.cart[chosenItemIndex].quantity = newValue;
            }
            window.localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        loadCategories(state, categories) {
            Object.assign(state.categories, categories);
        },
        loadProducts(state, products) {
            Object.assign(state.products, products);
        },
        loadCart(state, cart) {
            Object.assign(state.cart, cart);
        }
    }
});

export default store;