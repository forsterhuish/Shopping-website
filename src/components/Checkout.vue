<script setup>
    import { computed, onBeforeMount, onMounted } from 'vue';
    import { loadScript } from "@paypal/paypal-js";
    import { useStore } from 'vuex';
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    // Bootstrap Icon
    import "bootstrap-icons/font/bootstrap-icons.css";
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
                await paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    "currency_code": "HKD",
                                    "value": store.state.totalAmount,
                                },
                            }],
                        })
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((orderData) => {
                            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                            const transaction = orderData.purchase_units[0].payments.captures[0];
                            alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
                        });
                    }
                }).render("#paypal-button-container");
            } catch (error) {
                console.error("failed to render the PayPal Buttons", error);
            }
        }
        // paypal.Buttons({
        //     // style: {
        //     //     shape: "rect",
        //     //     color: "blue",
        //     //     layout: "vertical",
        //     //     label: "paypal",
        //     //     size: "medium"
        //     // },
        //     createOrder: (data, actions) => {
        //         return actions.order.create({
        //             purchase_units: [{
        //                 amount: {
        //                     value: store.state.cart.reduce((prev, curr) => prev + Number(findItem(curr).price) * curr.quantity, 0).toFixed(2)
        //                 }
        //             }]
        //         })
        //     },
        //     onApprove: (data, actions) => {
        //         return actions.order.capture().then((orderData) => {
        //             console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        //             const transaction = orderData.purchase_units[0].payments.captures[0];
        //             alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
        //         });
        //     }
        // }).render("#paypal-button-container");
    }

    onMounted(() => {
        mountPaypalButton();
    })
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Checkout</h1>
        <div id="paypal-button-container"></div>
    </div>
</template>

<style scoped>

</style>