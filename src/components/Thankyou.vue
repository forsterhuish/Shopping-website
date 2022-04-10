<script setup>
    import { useRouter } from "vue-router";
    import { useStore } from "vuex";
    // Bootstrap
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
    // Bootstrap Icon
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { onBeforeUnmount } from "vue";
    const router = useRouter();
    const store = useStore();
    const props = defineProps({
        orderID: {
            type: Number,
            required: true,
        },
    });
    const backToHome = () => {
        router.push("/");
    }
    // onBeforeUnmount(() => {
    //     // Clear cart
    //     store.commit('emptyCart');
    //     // Clear all localStorage data, including cart
    //     window.localStorage.clear();
    //     // Redirect back to home page
    // });
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Thank you for shopping :)</h1>
        <h3 class="m-3">Reference ID: {{ props.orderID }}</h3>
        <p class="m-3">Please keep the ID for later reference.</p>
        <p class="m-3">Hope to see you soon!</p>
        <button class="btn btn-primary m-3" @click="backToHome">Back To Home Page</button>
    </div>
</template>

<style scoped>

</style>