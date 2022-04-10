<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { onBeforeMount } from "vue";
const router = useRouter();
const store = useStore();
const backToHome = () => {
    router.push('/');
};

const getUserOrderHistory = async () => {
    const res = await fetch('/admin/order_mgnt.php?action=get_user_order', { credentials: 'same-origin' });
    const res_text = await res.text();
    const res_json = JSON.parse(res_text.split(";")[1]);
    if (res_json['success'] !== undefined) {
        let orders = JSON.parse(res_json['success']);
        console.log(orders);
        let str = "";
        for (const entry of orders) {
            for (const property in entry) {
                if (property === "items") {
                    let items = JSON.parse(entry[property]);
                    str += `${property}: \n`;
                    for (const item of items) {
                        for (const en in item) {
                            str += `${en}: `;
                            if (en === "unit_amount") {
                                // console.log(item[en]);
                                for (const unit in item[en]) {
                                    str += `${unit}: ${item[en][unit]}\n`;
                                }
                            }
                            else 
                                str += `${item[en]}\n`;
                        }
                    }
                }
                else str += `${property}: ${entry[property]}\n`;
            }
            str += "\n\n";
        }
        document.querySelector("#order_hist").innerText = str;
    }
}

onBeforeMount(() => {
    getUserOrderHistory();
});
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Your Order History</h1>
        <button class="btn btn-success m-3" @click="backToHome">Back To Home Page</button>
        <div class="row">
            <div id="order_hist"></div>
        </div>
    </div>
</template>

<style scoped>

</style>