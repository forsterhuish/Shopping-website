<script setup>
    import { computed, onBeforeMount, onMounted } from 'vue';
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
            paypal = await loadScript({ "client-id": "Ad1Vw5iqQmRgQ4iLPgwN8JYZE3OTgjly7x3rQtdZhiyd9DpMW2t6x-M3KMohXrBK6iS-HZZxq8JTzsyo", currency: "HKD" })
        } catch (error) {
            console.error("failed to load the PayPal JS SDK script", error);
        }

        if (paypal) {
            try {
                // let orderDetails = {
                //     // Server return something like this
                //     purchase_units: [{
                //         amount: {
                //             currency_code: "HKD",
                //             value: store.state.totalAmount,
                //         },
                //     }],
                // };
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
                        return actions.order.create({
                            purchase_units: res_json
                        });
                    },
                    onApprove: async (data, actions) => {
                        const orderData = await actions.order.capture();
                        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                        const transaction = orderData.purchase_units[0].payments.captures[0];
                        alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
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
    })
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Checkout</h1>
        <button class="btn btn-primary m-3 d-block" @click="backToPrev">Back to Previous Page</button>

        <!-- PayPal Button -->
        <div id="paypal-button-container"></div>
    </div>
</template>

<style scoped>

</style>