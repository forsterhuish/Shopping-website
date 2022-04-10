<script setup>
    import { onMounted, onBeforeUnmount } from 'vue';
    import { loadScript } from "@paypal/paypal-js";
    import { useRouter } from "vue-router";
    import { useStore } from "vuex";
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    // Bootstrap Icon
    import "bootstrap-icons/font/bootstrap-icons.css";
    const router = useRouter();
    const store = useStore();

    const mountPaypalButton = async () => {
        let paypal;
        try {
            paypal = await loadScript({ "client-id": "AWAhG5MUglDOpPc5QUEBDl-q4F_o0w2c7X8v3GOKNjYfM6gZwFHahyErHm4jIY0eMwTbK-iQfylgIOAb", currency: "HKD"/*, "disable-funding": "card,credit", "data-page-type": "cart", commit: true*/ })
        } catch (error) {
            console.error("failed to load the PayPal JS SDK script", error);
        }

        if (paypal) {
            try {
                await paypal.Buttons({
                    createOrder: async (data, actions) => {
                        let postData = new FormData();
                        postData.append("cart", JSON.stringify(store.state.cart));
                        postData.append("total", store.state.totalAmount);
                        const r = await fetch("/admin/order_mgnt.php?action=gen_order", { 
                            method: "post", 
                            body: postData
                        });
                        const res_text = await r.text();
                        let res = "";
                        if (res_text.split(";").length <= 1) {
                            return;
                        } 
                        else 
                            res = JSON.parse(res_text.split(";")[1]);
                        if (res['success'] === undefined) return;
                        const res_json = JSON.parse(res['success']);
                        // console.log(res_json)
                        return actions.order.create(res_json);
                    },
                    onApprove: async (data, actions) => {
                        const orderData = await actions.order.capture();
                        // console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                        // const transaction = orderData.purchase_units[0].payments.captures[0];
                        // alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
                        const order_id = orderData.purchase_units[0].custom_id;
                        // console.log(`Thank you for shopping!\nYour Order ID is ${order_id}. `);
                        // router.push({ name: "thankyou", params: { orderID: order_id }});
                        router.replace("/");
                    }
                }).render("#paypal-button-container");
            } catch (error) {
                console.error("failed to render the PayPal Buttons", error);
            }
        }
    }

    const backToPrev = () => {
        router.go(-1); // back to previous page
    }

    onMounted(() => {
        mountPaypalButton();
    });

    onBeforeUnmount(() => {
        // Clear cart
        store.commit('emptyCart');
        // Clear all localStorage data, including cart
        window.localStorage.clear();
        // Redirect back to home page
    });
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Checkout</h1>
        <button class="btn btn-primary m-3 d-block" @click="backToPrev">Back to Previous Page</button>

        <!-- PayPal Button -->
        <div id="paypal-button-container"></div>
        <input type="hidden" name="notify_url" value="/ipn_listener.php">
    </div>
</template>

<style scoped>

</style>