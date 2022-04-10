<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { useRouter } from "vue-router";
import store from "../vuex";
const router = useRouter();
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

const changePassword = async () => {
    let userName = "", oldPassword = escapeHTML(oldPw), newPassword = "";
    let validated = false;
    if (!testEmail(username)) {
        displayWarning("#user-name-change");
        validated = false;
    }
    else {
        removeWarning("#user-name-change");
        userName = escapeHTML(username);
        validated = true;
    }
    if (!testPassword(newPw)) {
        displayWarning("#new-password");
        validated = false;
    }
    else {
        removeWarning("#new-password");
        newPassword = escapeHTML(newPw);
        if (validated === true) validated = true;
    }
    if (!validated) return;
    else {
        removeWarning("#user-name-change");
        removeWarning("#old-password");
        const n = await fetch('/admin/csrf.php?csrf_action=getNonce&action=change_password');
        const nonce = await n.text();
        // console.log(nonce);
        let postData = new FormData();
        postData.append("username", userName);
        postData.append("old_pw", oldPassword);
        postData.append("new_pw", newPassword);
        const res = await fetch('/admin/user_mgnt.php?action=change_password', {
            method: 'POST',
            body: postData
        });
        const res_text = await res.text();
        const res_json = JSON.parse(res_text.split(";")[1]);
        // console.log(res_json);
        if (res_json['success']) {
            // logout user
            const res = await fetch('/admin/user_mgnt.php?action=logout');
            const res_text = await res.text();
            const res_json = JSON.parse(res_text.split(";")[1]);
            // console.log(res_json);

            if (res_json['success'] === true) {
                store.commit('setCurrentUser', { name: "Guest", isAdmin: false, logon: false });
                // Go to home page
                router.push('/');
            }
        }
        else {
            displayWarning("#user-name-change");
            displayWarning("#old-password");
        }
    }
}

const backToHome = (e) => {
    e.preventDefault();
    router.push('/');
};
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Change Password</h1>
        <h3 class="d-inline">(<span style="color: red">*</span>: required)</h3>
        <button class="btn btn-secondary m-3 d-inline" @click="backToHome">
            Back to Home
        </button>
        <div class="row">
            <div class="col">
                <fieldset>
                    <legend class="m-3">Change Password</legend>
                    <form @submit.prevent="changePassword" id="change-pw-form">
                        <div class="m-3">
                            <label class="form-label required" for="user-name-change">User Name</label>
                            <input v-model="username" 
                                id="user-name-change" 
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="username input change pw"
                                required="true"
                            >
                            <div class="invalid-feedback">
                                Invalid username and/or password.  
                            </div>
                        </div>
                        <div class="m-3">
                            <label class="form-label required" for="old-password">Old Password</label>
                            <input v-model="oldPw" 
                                id="old-password" 
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="old pw"
                                required="true"
                            >
                            <div class="invalid-feedback">
                                Invalid password.  
                            </div>
                        </div>
                        <div class="m-3">
                            <label class="form-label required" for="new-password">New Password</label>
                            <input v-model="newPw" 
                                id="new-password" 
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="new pw"
                                required="true"
                            >
                            <div class="invalid-feedback">
                                Invalid username and/or password.  
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

</style>