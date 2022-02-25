import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            currentPageID: 0,
            categories: ["Food", "Beverages"],
            currentProductID: -1,
            cart: [
                {
                    id: 11,
                    name: "Coke", 
                    price: 2,
                    quantity: 1, 
                }, 
                { 
                    id: 1,
                    name: "Orange", 
                    price: 5.5,
                    quantity: 3, 
                }
            ],
            products: [
                {
                    id: 1,
                    category: "Food",
                    name: "Orange",
                    price: 5.5,
                    inventory: 20
                },
                {
                    id: 2,
                    category: "Food",
                    name: "Grape",
                    price: 5.23,
                    inventory: 20
                },
                {
                    id: 3,
                    category: "Food",
                    name: "Ginger",
                    price: 6.73,
                    inventory: 20
                },
                {
                    id: 4,
                    category: "Food",
                    name: "Peanuts",
                    price: 5,
                    inventory: 20
                },
                {
                    id: 5,
                    category: "Food",
                    name: "Bread",
                    price: 5,
                    inventory: 20
                },
                {
                    id: 6,
                    category: "Food",
                    name: "Jam",
                    price: 3.3,
                    inventory: 20
                },
                {
                    id: 7,
                    category: "Food",
                    name: "Pork",
                    price: 20,
                    inventory: 20
                },
                {
                    id: 8,
                    category: "Food",
                    name: "Salmon",
                    price: 23,
                    inventory: 20
                },
                {
                    id: 9,
                    category: "Food",
                    name: "Shrimp",
                    price: 12.23,
                    inventory: 20
                },
                {
                    id: 10,
                    category: "Food",
                    name: "Cookies",
                    price: 12.1,
                    inventory: 20
                },
                {
                    id: 11,
                    category: "Beverages",
                    name: "Coke",
                    price: 14.2,
                    inventory: 20
                },
                {
                    id: 12,
                    category: "Beverages",
                    name: "Soda Water",
                    price: 13.2,
                    inventory: 20
                },
                {
                    id: 13,
                    category: "Beverages",
                    name: "Coffee",
                    price: 16.2,
                    inventory: 20
                },
                {
                    id: 14,
                    category: "Beverages",
                    name: "Earl Grey",
                    price: 18,
                    inventory: 20
                },
                {
                    id: 15,
                    category: "Beverages",
                    name: "Orange Juice",
                    price: 12,
                    inventory: 20
                },
                {
                    id: 16,
                    category: "Beverages",
                    name: "Beer",
                    price: 13.23,
                    inventory: 20
                },
                {
                    id: 17,
                    category: "Beverages",
                    name: "Coke",
                    price: 2,
                    inventory: 20
                },
                {
                    id: 18,
                    category: "Beverages",
                    name: "Sprite",
                    price: 2,
                    inventory: 20
                },
                {
                    id: 19,
                    category: "Beverages",
                    name: "Vodka",
                    price: 20,
                    inventory: 20
                },
                {
                    id: 20,
                    category: "Beverages",
                    name: "Red Wine",
                    price: 50,
                    inventory: 20
                },
            ],
            showProductDetails: false,
            showCart: false,
            imageURL: ""
        }
    },
    mutations: {
        updatePageID(state, index) {
            state.currentPageID = index;
        },
        updateProductID(state, index) {
            state.currentProductID = index;
        },
        showProductDetails(state) {
            state.showProductDetails = true;
        },
        showImageURL(state, productID) {
            state.imageURL = `../../assets/images/${String(state.products[productID-1].category).toLowerCase()}`;
        },
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
    }
});

export default store;