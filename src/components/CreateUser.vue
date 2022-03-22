<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { useRouter } from "vue-router";
const router = useRouter();
let email = "";
let password = "";

const testEmail = (input) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
const testPassword = (input) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(input);

const displayWarning = (inputSelector = "", warningTextSelector = "", text = "") => {
    document.querySelector(inputSelector).classList.add("is-invalid");
    if (text.length > 0 && warningTextSelector.length > 0) {
        document.querySelector(warningTextSelector).innerHTML = text;
    }
};

const removeWarning = (selector) => {
    document.querySelector(selector).classList.remove("is-invalid");
};

const createUser = async () => {
    let user_email = "", user_pw = "";
    let validated = false;
    if (!testEmail(email)) {
        displayWarning("#user-name");
        validated = false;
    }
    else {
        removeWarning("#user-name");
        user_email = email;
        validated = true;
    }
    if (!testPassword(password)) {
        displayWarning("#password");
        validated = false;
    }
    else {
        removeWarning("#password");
        user_pw = password;
        if (validated === true) validated = true;
    }
    if (!validated) return;
    else {
        let postData = new FormData();
        postData.append("email", user_email);
        postData.append("pw", user_pw);
        const res = await fetch('/admin/admin-process.php?action=createUser', {
            method: 'POST',
            body: postData
        });
        const res_text = await res.text();
        const res_json = JSON.parse(res_text.split(";")[1])
        console.log(res_json);

        if (res_json['success'] === true)
            // Go to login page
            router.push('/login');
    }
}

const backToLogin = (e) => {
    e.preventDefault();
    router.push('/login');
}
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Create a New User</h1>
        <h3 class="d-inline">(<span style="color: red">*</span>: required)</h3>
        <button class="btn btn-secondary m-3 d-block" @click="backToLogin">
            Back to Login Page
        </button>
        <div class="row">
            <div class="col">
                <fieldset>
                    <legend class="m-3">Create New User</legend>
                    <form @submit.prevent="createUser">
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
                                Please enter a valid user name.
                            </div>
                        </div>
                        <div class="m-3">
                            <label class="form-label required" for="password">Password</label>
                            <input v-model="password" 
                                id="password" 
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="password input"
                                required="true"
                            >
                            <div class="invalid-feedback">
                                Please enter a valid password.
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