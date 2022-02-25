<script setup>
// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import * as axios from "axios";

let cat_actionID = -1, cat_catName = "";
let prod_actionID = -1, prod_catName = "", prod_prodName = "", prod_prodPrice = null, prod_prodDescription = "";
const cat_actions = ["Insert", "Delete"];
const prod_actions = ["Insert", "Delete", "Update"];
let prod_photoObj = {};

const escapeHTML = (unsafeStr = '') => unsafeStr.toString().replaceAll('&', "&amp;").replaceAll('<', "&lt;").replaceAll('>', "&gt;").replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const isImage = (file) => (file instanceof File) && (
    file.type.startsWith("image") && 
    (
        file.type.endsWith("jpeg")    ||
        file.type.endsWith("jpg")     ||
        file.type.endsWith("png")     ||
        file.type.endsWith("gif")
    )
);

const setImage = (e) => {
    prod_photoObj = e.target.files[0];
}

const uploadImage = async (image) => {
    try {
        const res = await fetch(`/images/` + image.name, { 
            method: 'PUT', 
            body: image
        });
        console.log(`Upload Status: ${res.statusText}`);
    } catch (e) {
        alert("Error Uploading Photo");
        return;
    }
}

const displayWarning = (inputSelector, warningTextSelector, text = '') => {
    document.querySelector(inputSelector).classList.add("is-invalid");
    if (text.length > 0 && warningTextSelector.length > 0) {
        document.querySelector(warningTextSelector).innerHTML = text;
    }
}

const removeWarning = (selector) => {
    document.querySelector(selector).classList.remove("is-invalid");
}

const catFormSubmit = () => {
    // Verified category management form
    let validated = false;
    let action = "", cat_cat_Name = "";
    if (cat_actionID === undefined || cat_actionID < 0) {
        displayWarning("#cat_action");
        validated = false;
    }
    else {
        removeWarning("#cat_action");
        action = cat_actions[cat_actionID];
        validated = true;
    }
    if (!cat_catName || cat_catName.length <= 0) {
        displayWarning("#cat_name");
        validated = false;
    }
    else {
        removeWarning("#cat_name");
        cat_cat_Name = escapeHTML(cat_catName);
        if (validated) validated = true;
    }
    if (!validated) return;
    else {
        console.log("Can submit!")
        // console.log(cat_actionID);
        // console.log(cat_actions[cat_actionID]);
        // console.log(cat_cat_Name)
    }

    // const res = await axios.get('/php/example.php');
    // console.log(res.data)
}
const prodFormSubmit = () => {
    // Verified product management form
    let validated = false;
    let action = "", prod_cat_Name = "", prod_prod_Name = "", prod_prod_price = 0, prod_prod_description = "";
    if (prod_actionID === undefined || prod_actionID < 0) {
        displayWarning("#prod_action");
        validated = false;
    }
    else {
        removeWarning("#prod_action");
        action = prod_actions[prod_actionID];
        validated = true;
    }
    if (!prod_catName || (prod_catName && prod_catName.length <= 0)) {
        displayWarning("#prod_cat");
        validated = false;
    }
    else {
        removeWarning("#prod_cat");
        prod_cat_Name = escapeHTML(prod_catName);
        if (validated) validated = true;
    }
    if (!prod_prodName || (prod_prodName && prod_prodName.length <= 0)) {
        displayWarning("#prod_name");
        validated = false;
    }
    else {
        removeWarning("#prod_name");
        prod_prod_Name = escapeHTML(prod_prodName);
        if (validated) validated = true;
    }
    if (prod_prodPrice === undefined || isNaN(prod_prodPrice) || prod_prodPrice < 0) {
        displayWarning("#prod_price")
        validated = false;
    }
    else {
        removeWarning("#prod_price");
        prod_prod_price = Number(prod_prodPrice);
        if (validated) validated = true;
    }
    prod_prod_description = escapeHTML(prod_prodDescription) || "";

    if (!isImage(prod_photoObj)) {
        displayWarning("#prod_photo");
        validated = false;
    }
    else if (prod_photoObj.size > 10485760) {
        displayWarning("#prod_photo", "#invalid-photo-text", "File Size Too Large.")
    }
    else {
        removeWarning("#prod_photo");
        if (validated) validated = true;
    }

    // Not finished
    if (!validated) return;
    else {
        console.log("Can submit!")
        uploadImage(prod_photoObj);
        console.log(action, prod_cat_Name, prod_prod_Name, prod_prod_price, prod_prod_description, prod_photoObj);
    }
    // const res = await axios.get('/php/example.php');
    // console.log(res.data)
}
</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Admin Page</h1>
        <h3 class="d-inline">
            (<span style="color: red">*</span>: required)
        </h3>
        <div class="row">
            <div class="col">
                <fieldset>
                    <legend class="m-3">Manage Categories</legend>
                    <form @submit.prevent="catFormSubmit" novalidate>
                        <div class="m-3">
                            <!-- Select Action Type -->
                            <label class="form-label" for="action-id">Action</label>
                            <select
                                id="cat_action"
                                class="form-select"
                                v-model.number="cat_actionID"
                                required="true"
                            >
                                <option disabled value>Please select one</option>
                                <option selected value="0">INSERT New Category</option>
                                <option value="1">DELETE Existing Category</option>
                            </select>
                            <div class="invalid-feedback">Please choose an action.</div>
                        </div>
                        <div class="m-3">
                            <label for="cat_name" class="form-label required">Category Name</label>
                            <input
                                v-model="cat_catName"
                                id="cat_name"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="cat name input"
                                required="true"
                            />
                            <div class="invalid-feedback">Please enter a valid category name.</div>
                        </div>
                        <div class="m-3">
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </fieldset>
            </div>
            <div class="col">
                <fieldset>
                    <legend class="m-3">Manage Products</legend>
                    <form @submit.prevent="prodFormSubmit" novalidate>
                        <div class="m-3">
                            <!-- Select Action Type -->
                            <label class="form-label" for="action-id">Action</label>
                            <select
                                v-model.number="prod_actionID"
                                id="prod_action"
                                class="form-select"
                                required="true"
                            >
                                <option disabled value>Please select one</option>
                                <option selected value="0">INSERT New Product</option>
                                <option value="1">DELETE Existing Product</option>
                                <option value="2">UPDATE Existing Product</option>
                            </select>
                            <div class="invalid-feedback">Please choose an action.</div>
                        </div>
                        <div class="m-3">
                            <label for="prod_cat" class="form-label required">Category Name</label>
                            <input
                                v-model="prod_catName"
                                id="prod_cat"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="cat name input"
                                required="true"
                            />
                            <div class="invalid-feedback">Please enter a valid category name.</div>
                        </div>
                        <div class="m-3">
                            <label for="prod_name" class="form-label required">Product Name</label>
                            <input
                                v-model="prod_prodName"
                                id="prod_name"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="prod name input"
                                required="true"
                            />
                            <div class="invalid-feedback">Please enter a valid product name.</div>
                        </div>
                        <div class="m-3">
                            <label for="prod_price" class="form-label required">Product Price</label>
                            <input
                                v-model.number="prod_prodPrice"
                                id="prod_price"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="prod price input"
                                required="true"
                            />
                            <div class="invalid-feedback">Please enter a valid product price.</div>
                        </div>
                        <div class="m-3">
                            <label for="prod_description" class="form-label">Product Description</label>
                            <textarea
                                v-model="prod_prodDescription"
                                id="prod_description"
                                class="form-control form-control-lg"
                                row="3"
                            />
                        </div>
                        <div class="m-3">
                            <label
                                for="prod_photo"
                                class="form-label required"
                            >
                                Product Photo (Should not exceed 10MB)
                            </label>
                            <input id="prod_photo" class="form-control" type="file" @change="setImage" required="true"/>
                            <div class="invalid-feedback" id="invalid-photo-text">Please provide a valid product photo.</div>
                        </div>
                        <div class="m-3">
                            <input type="submit" value="Submit" />
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