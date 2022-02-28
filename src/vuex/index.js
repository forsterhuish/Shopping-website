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
            const itemIndex = state.cart.findIndex((item) => item.id === newItem.id);
            if (itemIndex >= 0)
                state.cart[itemIndex].quantity += 1;
            else
                state.cart.push(newItem);
        },
        removeItemFromCart(state, itemIndex) {
            state.cart.splice(itemIndex, 1);
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
        },
        loadCategories(state, categories) {
            Object.assign(state.categories, categories);
        },
        loadProducts(state, products) {
            Object.assign(state.products, products);
        }
    }
});

export default store;