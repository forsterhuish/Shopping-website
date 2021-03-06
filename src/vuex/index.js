import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            currentCatID: 0,
            categories: [],
            // loadedCategories: [],
            currentProductID: -1,
            cart: [],
            totalAmount: 0,
            products: [],
            showProductDetails: false,
            showCart: false,
            imageURL: "",
            maxProduct: 10,
            currentUser: { name: "Guest", isAdmin: false, logon: false },
        }
    },
    mutations: {
        updateCatID(state, index) {
            if (isNaN(index)) return;
            state.currentCatID = index;
            // if (index > 0 && !state.loadedCategories.includes(index)) {
            //     // Only load product when haven't loaded yet
            //     const res = await fetch(`/admin/prod_id.php?catid=${index}`);
            //     const res_json = await res.json();
            //     store.commit('loadProducts', res_json);
            //     state.loadedCategories.push(index);
            // }
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
            store.commit('updateTotalAmount');
        },
        removeItemFromCart(state, itemIndex) {
            state.cart.splice(itemIndex, 1);
            window.localStorage.setItem('cart', JSON.stringify(state.cart));
            store.commit('updateTotalAmount');
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
            store.commit('updateTotalAmount');
        },
        loadCategories(state, categories = null) {
            if (Array.isArray(categories) && Array.isArray(state.categories)) {
                Object.assign(state.categories, categories);
            }
        },
        loadProducts(state, products = null) {
            if (Array.isArray(products) && Array.isArray(state.products)) {
                Object.assign(state.products, products);
            }
        },
        loadCart(state, cart) {
            if (Array.isArray(cart))
                Object.assign(state.cart, cart);
            store.commit('updateTotalAmount');
        },
        emptyCart(state) {
            state.cart = [];
            store.commit('updateTotalAmount');
        },
        updateMaxProd(state, value = 0) {
            if (value > 0) state.maxProduct = value;
        },
        setCurrentUser(state, user = null) {
            if (user) {
                state.currentUser.name = user.name;
                state.currentUser.isAdmin = user.isAdmin;
                state.currentUser.logon = user.logon;
            }
        },
        updateTotalAmount(state) {
            state.totalAmount = state.cart.reduce((prev, curr) => prev + Number(state.products.find(i => i.pid === curr.pid).price) * curr.quantity, 0);
        }
    }
});

export default store;