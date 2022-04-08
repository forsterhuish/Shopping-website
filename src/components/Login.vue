<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { useRouter } from "vue-router";
import store from "../vuex";
const router = useRouter();
let email = "";
let password = "";
let username = "";
let oldPw = "";
let newPw = "";

const escapeHTML = (unsafeStr = "") =>
    unsafeStr
        .toString()
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

const testEmail = (input) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
const testPassword = (input) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(input);

const displayWarning = (inputSelector = "", warningTextSelector = "", text = "") => {
    document.querySelector(inputSelector).classList.add("is-invalid");
    if (text.length > 0 && warningTextSelector.length > 0) {
        document.querySelector(warningTextSelector).innerHTML = text;
    }
};

const removeWarning = (selector) => {
    if (document.querySelector(selector).classList.contains("is-invalid"))
        document.querySelector(selector).classList.remove("is-invalid");
};

const login = async () => {
    let user_email = escapeHTML(email), user_pw = escapeHTML(password);
    const n = await fetch('/admin/csrf.php?csrf_action=getNonce&action=login');
    const nonce = await n.text();
    // console.log(nonce);
    let postData = new FormData();
    postData.append("email", user_email);
    postData.append("pw", user_pw);
    removeWarning("#user-name");
    removeWarning("#password");

    // Clear form
    // document.getElementById("login-form").reset();
    const res = await fetch('/admin/user_mgnt.php?action=login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
        body: postData,
        credentials: 'include'
    });
    const res_text = await res.text();
    const res_json = JSON.parse(res_text.split(";")[1])
    // console.log(res_json);

    if (res_json['success']) {
        const detail_json = JSON.parse(res_json['success']);
        if (detail_json['email'].length > 0)
            store.commit('setCurrentUser', { name: detail_json['email'], isAdmin: detail_json['admin'] === 1 ? true : false, logon: true });
        if (detail_json['admin'] === 1) {
            // Go to admin page
            router.push('/admin-panel');
        }
        else router.push('/');
    }
    else if (res_json['failed']) {
        displayWarning("#user-name");
        displayWarning("#password");
    }
}

const createUserPage = (e) => {
    e.preventDefault();
    router.push('/create-user');
}

const backToHome = (e) => {
    e.preventDefault();
    router.push('/');
};
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Login Page</h1>
        <h3 class="d-inline">(<span style="color: red">*</span>: required)</h3>
        <button class="btn btn-secondary m-3 d-inline" @click="backToHome">
            Back to Home
        </button>
        <button class="btn btn-secondary m-3 d-inline" @click="createUserPage">
            Create a new user
        </button>
        <div class="row">
            <div class="col">
                <fieldset>
                    <legend class="m-3">Login</legend>
                    <form @submit.prevent="login" id="login-form">
                        <div class="m-3">
                            <label class="form-label required" for="user-name">Name</label>
                            <input v-model="email" 
                                id="user-name" 
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="username input"
                                required="true"
                            >
                            <div class="invalid-feedback">
                                Wrong username and/or password. 
                            </div>
                        </div>
                        <div class="m-3">
                            <label class="form-label required" for="password">Password</label>
                            <input v-model="password" 
                                id="password" 
                                class="form-control form-control-lg"
                                type="password"
                                aria-label="password input"
                                required="true"
                            >
                            <div class="invalid-feedback">
                                Wrong username and/or password. 
                            </div>
                        </div>
                        <div class="m-3">
                            <input
                                class="btn btn-primary"
                                type="submit"
                                value="Submit"
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    </div>
</template>

<style scoped>
.required::after {
    content: " *";
    color: red;
}
</style>