<script setup>
// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { onBeforeMount } from "vue";
const router = useRouter();
const store = useStore();

let cat_actionID = -1,
    cat_ID = null,
    cat_catName = "";
let prod_actionID = -1,
    prod_ID = null,
    prod_catName = "",
    prod_prodName = "",
    prod_prodPrice = null,
    prod_prodStock = null,
    prod_prodDescription = "";
const cat_actions = ["cat_insert", "cat_update", "cat_delete"];
const prod_actions = ["prod_insert", "prod_update", "prod_delete"];
let prod_photoObj = {};
let DAD_image = {}; // Drag-and-drop photo

const escapeHTML = (unsafeStr = "") =>
    unsafeStr
        .toString()
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

const isImage = (file) =>
    file instanceof File &&
    file.type.startsWith("image") &&
    (file.type.endsWith("jpeg") ||
        file.type.endsWith("jpg") ||
        file.type.endsWith("png") ||
        file.type.endsWith("gif"));

const setImage = (e) => {
    prod_photoObj = e.target.files[0];
};

const displayDADImage = (e) => {
    if (!isImage(e.target.files[0])) {
        displayWarning(
            "#dad_image",
            "#dad_invalid",
            "Invalid Input File Format."
        );
        document.querySelector("#dad_image").value = null;
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const DAD_image = reader.result;
        document.querySelector(
            "#product-thumbnail"
        ).style.backgroundImage = `url(${DAD_image})`;
        document.querySelector("#dad_image").value = null;
    };
    reader.readAsDataURL(e.target.files[0]);
};

const uploadImage = async (image) => {
    try {
        const res = await fetch(`/images/` + image.name, {
            method: "PUT",
            body: image,
        });
        // console.log(`Upload Status: ${res.statusText}`);
    } catch (e) {
        alert("Error Uploading Photo");
        return;
    }
};

const displayWarning = (inputSelector = "", warningTextSelector = "", text = "") => {
    document.querySelector(inputSelector).classList.add("is-invalid");
    if (text.length > 0 && warningTextSelector.length > 0) {
        document.querySelector(warningTextSelector).innerHTML = text;
    }
};

const removeWarning = (selector) => {
    document.querySelector(selector).classList.remove("is-invalid");
};

const testID = (input) => /^\d+$/.test(input);
const testStr = (input) => /^[\w\-]+$/.test(input);

const catFormSubmit = async () => {
    // Verified category management form
    let validated = false;
    let action = "",
        cat_cat_Name = "";
    if (cat_actionID < 0) {
        displayWarning("#cat_action");
        validated = false;
    } else {
        removeWarning("#cat_action");
        action = cat_actions[cat_actionID];
        validated = true;
    }
    // if (isNaN(cat_ID)) {
    //     displayWarning("#cat_id");
    //     validated = false;
    // } else {
    //     removeWarning("#cat_id");
    //     if (validated === true) validated = true;
    // }
    if (!cat_catName || cat_catName.length <= 0) {
        displayWarning("#cat_name");
        validated = false;
    } else {
        removeWarning("#cat_name");
        cat_cat_Name = escapeHTML(cat_catName);
        if (validated === true) validated = true;
    }
    if (!validated) return;
    else {
        const n = await fetch(`/admin/csrf.php?csrf_action=getNonce&action=${action}`, { credentials: 'same-origin' });
        const nce = await n.text();
        const nonce = parseInt(JSON.parse(nce.split(";")[1])["success"]);
        // console.log(nonce);
        let postData = new FormData();
        postData.append("nonce", nonce);
        postData.append("name", cat_cat_Name);

        const res = await fetch(`/admin/admin-process.php?action=${action}`, {
            method: "POST",
            body: postData,
            credentials: 'include'
        });
        const res_text = await res.text();
        // if (res_text.split(";").length <= 1) {
        //     console.log(JSON.parse(res_text));
        // } 
        // else 
        //     console.log(JSON.parse(res_text.split(";")[1]));
    }
};
const prodFormSubmit = async () => {
    // Verified product management form
    let validated = false;
    let action = "",
        prod_cat_Name = "",
        prod_prod_Name = "",
        prod_prod_price = 0,
        prod_prod_description = "",
        prod_prod_stock = 0;
    if (prod_actionID === undefined || prod_actionID < 0) {
        displayWarning("#prod_action");
        validated = false;
    } else {
        removeWarning("#prod_action");
        action = prod_actions[prod_actionID];
        validated = true;
    }
    if (!prod_catName || (prod_catName && prod_catName.length <= 0) || !testStr(prod_catName)) {
        displayWarning("#prod_cat");
        validated = false;
    } else {
        removeWarning("#prod_cat");
        prod_cat_Name = escapeHTML(prod_catName);
        if (validated === true) validated = true;
    }
    if (!prod_prodName || (prod_prodName && prod_prodName.length <= 0) || !testStr(prod_prodName)) {
        displayWarning("#prod_name");
        validated = false;
    } else {
        removeWarning("#prod_name");
        prod_prod_Name = escapeHTML(prod_prodName);
        if (validated === true) validated = true;
    }
    if (
        prod_prodPrice === null ||
        isNaN(prod_prodPrice) ||
        prod_prodPrice < 0
    ) {
        displayWarning("#prod_price");
        validated = false;
    } else {
        removeWarning("#prod_price");
        prod_prod_price = Number(prod_prodPrice);
        if (validated === true) validated = true;
    }
    if (
        prod_prodStock === null ||
        isNaN(prod_prodStock) ||
        prod_prodStock < 0
    ) {
        displayWarning("#prod_stock");
        validated = false;
    } else {
        removeWarning("#prod_stock");
        prod_prod_stock = Number(prod_prodStock);
        if (validated === true) validated = true;
    }
    if (!testStr(prod_prodDescription)) {
        displayWarning("#prod_description");
        validated = false;
    } else {
        removeWarning("#prod_description");
        prod_prod_description = escapeHTML(prod_prodDescription);
        if (validated === true) validated = true;
    }

    if (!isImage(prod_photoObj)) {
        displayWarning("#prod_photo");
        validated = false;
    } else if (prod_photoObj.size > 10485760) {
        displayWarning(
            "#prod_photo",
            "#invalid-photo-text",
            "File Size Too Large."
        );
    } else {
        removeWarning("#prod_photo");
        if (validated === true) validated = true;
    }

    if (!validated) return;
    else {
        const n = await fetch(`/admin/csrf.php?csrf_action=getNonce&action=${action}`, { 
            credentials: 'same-origin',
        });
        const nce = await n.text();
        const nonce = parseInt(JSON.parse(nce.split(";")[1])["success"]);
        // console.log(nonce);
        let postData = new FormData();
        postData.append("nonce", nonce);
        postData.append("prod-name", prod_prod_Name);
        if (action !== "prod_delete") {
            postData.append("cat-name", prod_cat_Name);
            postData.append("price", prod_prod_price);
            postData.append("stock", prod_prod_stock);
            postData.append("description", prod_prod_description);
            postData.append("file", prod_photoObj);
        }

        const res = await fetch(
            `/admin/admin-process.php?action=${action}`,
            {
                method: "POST",
                body: postData,
                credentials: 'include'
            }
        );
        const res_text = await res.text();
        // if (res_text.split(";").length <= 1) {
        //     console.log(JSON.parse(res_text));
        // } 
        // else 
        //     console.log(JSON.parse(res_text.split(";")[1]));
    }
};

const backToHome = (e) => {
    e.preventDefault();
    router.push('/');
};

const logout = async () => {
    if (confirm("Are you sure you want to logout? ")) {
        // handlePageChange(0);
        const res = await fetch('/admin/user_mgnt.php?action=logout', { 
            headers: {
                Accept: 'application/json',
            },
            credentials: 'include'
        });
        const res_text = await res.text();
        const res_json = JSON.parse(res_text.split(";")[1]);
        // console.log(res_json);

        if (res_json['success'] === true) {
            store.commit('setCurrentUser', { name: "Guest", isAdmin: false, logon: false });
            // Go to home page
            router.push('/');
        }
    }
}

const getAllOrders = async () => {
    const res = await fetch('admin/order_mgnt.php?action=get_orders');
    const res_text = await res.text();
    const res_json = JSON.parse(res_text.split(";")[1]);
    // console.log(res_json);
    if (res_json['success'] !== undefined) {
        let orders = JSON.parse(res_json['success']);
        // console.log(orders);
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
        document.querySelector("#orders_info").innerText = str;
    }
}

onBeforeMount(() => {
    getAllOrders();
});

</script>

<template>
    <div class="container">
        <h1 class="m-3 d-inline">Admin Page</h1>
        <h3 class="d-inline">(<span style="color: red">*</span>: required)</h3>
        <button class="btn btn-secondary m-3 d-block" @click="backToHome">
            Back to Home
        </button>
        <button class="btn btn-danger m-3 d-inline" @click="logout">
            Logout
        </button>
        <div class="row">
            <div class="col">
                <fieldset>
                    <legend class="m-3">Manage Categories</legend>
                    <form @submit.prevent="catFormSubmit" novalidate>
                        <div class="m-3">
                            <!-- Select Action Type -->
                            <label class="form-label" for="action-id"
                                >Action</label
                            >
                            <select
                                id="cat_action"
                                class="form-select"
                                v-model.number="cat_actionID"
                                required="true"
                            >
                                <option disabled value>
                                    Please select an action
                                </option>
                                <option selected>
                                    INSERT New Category
                                </option>
                                <option>
                                    UPDATE Existing Category
                                </option>
                                <option>
                                    DELETE Existing Category
                                </option>
                            </select>
                            <div class="invalid-feedback">
                                Please choose an action.
                            </div>
                        </div>
                        <!-- <div class="m-3">
                            <label for="cat_id" class="form-label required"
                                >Category ID</label
                            >
                            <input
                                v-model.number="cat_ID"
                                id="cat_id"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="cat id input"
                                required="true"
                            />
                            <div class="invalid-feedback">
                                Please enter a valid category ID.
                            </div>
                        </div> -->
                        <div class="m-3">
                            <label for="cat_name" class="form-label required"
                                >Category Name</label
                            >
                            <input
                                v-model="cat_catName"
                                id="cat_name"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="cat name input"
                                required="true"
                            />
                            <div class="invalid-feedback">
                                Please enter a valid category name.
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
            <div class="col">
                <fieldset>
                    <legend class="m-3">Manage Products</legend>
                    <form @submit.prevent="prodFormSubmit" novalidate>
                        <div class="m-3">
                            <!-- Select Action Type -->
                            <label class="form-label" for="action-id"
                                >Action</label
                            >
                            <select
                                v-model.number="prod_actionID"
                                id="prod_action"
                                class="form-select"
                                required="true"
                            >
                                <option disabled>
                                    Please select an action
                                </option>
                                <option selected>
                                    INSERT New Product
                                </option>
                                <option>
                                    UPDATE Existing Product
                                </option>
                                <option>
                                    DELETE Existing Product
                                </option>
                            </select>
                            <div class="invalid-feedback">
                                Please choose an action.
                            </div>
                        </div>
                        <div class="m-3">
                            <label for="prod_cat" class="form-label required"
                                >Category Name</label
                            >
                            <!-- <input
                                v-model="prod_catName"
                                id="prod_cat"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="cat name input"
                                required="true"
                            /> -->
                            <select
                                v-model="prod_catName"
                                id="prod_cat"
                                class="form-select"
                                required="true"
                            >
                                <option disabled>
                                    Please select one category
                                </option>
                                <option v-for="cat in store.state.categories">
                                    {{ cat.name }}
                                </option>
                            </select>
                            <div class="invalid-feedback">
                                Please select a valid category name.
                            </div>
                        </div>
                        <div class="m-3">
                            <label for="prod_name" class="form-label required"
                                >Product Name</label
                            >
                            <input
                                v-model="prod_prodName"
                                id="prod_name"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="prod name input"
                                required="true"
                            />
                            <div class="invalid-feedback">
                                Please enter a valid product name.
                            </div>
                        </div>
                        <div class="m-3">
                            <label for="prod_price" class="form-label required"
                                >Product Price</label
                            >
                            <input
                                v-model.number="prod_prodPrice"
                                id="prod_price"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="prod price input"
                                required="true"
                            />
                            <div class="invalid-feedback">
                                Please enter a valid product price.
                            </div>
                        </div>
                        <div class="m-3">
                            <label for="prod_stock" class="form-label required"
                                >Product Stock</label
                            >
                            <input
                                v-model.number="prod_prodStock"
                                id="prod_stock"
                                class="form-control form-control-lg"
                                type="text"
                                aria-label="prod stock input"
                                required="true"
                            />
                            <div class="invalid-feedback">
                                Please enter a valid product stock.
                            </div>
                        </div>
                        <div class="m-3">
                            <label
                                for="prod_description"
                                class="form-label required"
                                >Product Description</label
                            >
                            <textarea
                                v-model="prod_prodDescription"
                                id="prod_description"
                                class="form-control form-control-lg"
                                row="3"
                                required="true"
                            />
                            <div class="invalid-feedback">
                                Please enter the description.
                            </div>
                        </div>
                        <div class="m-3">
                            <label for="prod_photo" class="form-label required">
                                Product Photo (Should not exceed 10MB)
                            </label>
                            <input
                                id="prod_photo"
                                class="form-control"
                                type="file"
                                @change="setImage"
                                required="true"
                            />
                            <div
                                class="invalid-feedback"
                                id="invalid-photo-text"
                            >
                                Please provide a valid product photo.
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
        <div class="container">
            <div class="row">
                <div class="col">
                    <h3 class="m-3">Drag and Drop a photo here</h3>
                    <!-- Drag and Drop -->
                    <form class="m-3" novalidate @submit.prevent="">
                        <label for="dad_image" class="form-label"></label>
                        <input
                            id="dad_image"
                            class="form-control dad_box"
                            type="file"
                            @change="displayDADImage"
                            @click.prevent=""
                        />
                        <div id="dad_invalid" class="invalid-text"></div>
                    </form>
                </div>
                <div class="col">
                    <h3 class="m-3">Thumbnail</h3>
                    <img class="m-3" id="product-thumbnail" />
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col">
                    <h3 class="m-3">All Orders</h3>
                    <div class="m-3" id="orders_info"></div>
                    <!-- <button class="btn btn-primary m-3" @click="getAllOrders">Show All Orders</button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.required::after {
    content: " *";
    color: red;
}

.dad_box {
    display: block;
    width: 100%;
    max-width: 1080px;
    height: 100%;
    max-height: 880px;
    padding: 10em;
}

#product-thumbnail {
    width: 100%;
    height: 100%;
    max-height: 230px;
    max-width: 230px;
    background-position: center;
    background-size: cover;
    border: 1px solid black;
}
</style>
