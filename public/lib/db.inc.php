<?php
function ierg4210_DB() {
	// connect to the database
	// TODO: change the following path if needed
	// Warning: NEVER put your db in a publicly accessible location
	// $db = new PDO('sqlite:/var/www/cart.db');
    $db = new PDO('sqlite:/var/www/cart.db');

	// enable foreign key support
	$db->query('PRAGMA foreign_keys = ON;');

	// FETCH_ASSOC:
	// Specifies that the fetch method shall return each row as an
	// array indexed by column name as returned in the corresponding
	// result set. If the result set contains multiple columns with
	// the same name, PDO::FETCH_ASSOC returns only a single value
	// per column name.
	$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

	return $db;
}

function ierg4210_cat_getCatid($name) {
    global $db;
    $db = ierg4210_DB();
    if (!preg_match('/^[\w\- ]+$/', $name))
        throw new Exception("invalid-name");
    $q = $db->prepare("SELECT catid FROM categories WHERE name = ?;");
    $q->bindParam(1, $name);
    if ($q->execute())
        return $q->fetch()['catid'];
}

function ierg4210_cat_fetchall() {
    // DB manipulation
    // Get all categories
    global $db;
    $db = ierg4210_DB();
    $q = $db->prepare("SELECT * FROM categories LIMIT 100;");
    // $q = $db->prepare("SELECT * FROM categories WHERE catid = ? LIMIT 100;");
    // $q->bindParam(1, $catid);
    if ($q->execute())
        return $q->fetchAll();
}

// TODO: add other functions here to make the whole application complete
function ierg4210_cat_insert() {
    // Cat insert action
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        global $db;
        $db = ierg4210_DB();
        
        if (!preg_match('/^[\w\- ]+$/', $_POST['name']))
            throw new Exception("invalid-name");
        // $catid = $_POST['catid'];
        $name = $_POST['name'];
        $q = $db->prepare("INSERT INTO categories (name) VALUES (?);");
        $q->bindParam(1, $name);
        // $q->bindParam(1, $catid);
        // $q->bindParam(2, $name);
        if ($q->execute()) {
            return TRUE;
        }
        return FALSE;
    }
}
function ierg4210_cat_edit(){
    // Cat update action
    global $db;
    $db = ierg4210_DB();

    if (!preg_match('/^\d*$/', $_POST['catid']))
        throw new Exception("invalid-catid");
    $_POST['catid'] = (int) $_POST['catid'];
    if (!preg_match('/^[\w\- ]+$/', $_POST['name']))
        throw new Exception("invalid-name");
    $catid = $_POST['catid'];
    $name = $_POST['name'];
    $q = $db->prepare("UPDATE categories SET name = ? WHERE catid = ?;");
    $q->bindParam(1, $name);
    $q->bindParam(2, $catid);
    if ($q->execute())
        return TRUE;
    return FALSE;
}
function ierg4210_cat_delete(){
    // Cat delete action
    global $db;
    $db = ierg4210_DB();
    if (!preg_match('/^[\w\- ]+$/', $_POST['name']))
        throw new Exception("invalid-name");
    $name = $_POST['name'];
    print_r($name . "\n\n");
    $catid = (int)ierg4210_cat_getCatid($name);
    if (($result = ierg4210_prod_delete_by_catid($catid)) === TRUE) {
        $q = $db->prepare("DELETE FROM categories WHERE catid = ?;");
        $q->bindParam(1, $catid);
        if ($q->execute())
            return TRUE;
        return FALSE;
    }
}

function ierg4210_prod_delete_by_catid($catid){
    // delete all product based on catid
    global $db;
    $db = ierg4210_DB();

    if (!preg_match('/^\d*$/', $catid))
        throw new Exception("invalid-catid");
    $catid_int = (int) $catid;
    // $catid = $_POST['catid'];
    $q = $db->prepare("DELETE FROM products WHERE catid = ?;");
    $q->bindParam(1, $catid_int);
    if ($q->execute())
        return TRUE;
    return FALSE;
}

function ierg4210_prod_fetchall() {
    // fetch all products
    global $db;
    $db = ierg4210_DB();
    $q = $db->prepare("SELECT * FROM products LIMIT 100;");
    if ($q->execute())
        return $q->fetchAll();
    return NULL;
}

function ierg4210_prod_getPid($prod_name) {
    global $db;
    $db = ierg4210_DB();
    if (!preg_match('/^[\w\- ]+$/', $prod_name))
        throw new Exception("invalid-name");
    $q = $db->prepare("SELECT pid FROM products WHERE name = ?;");
    $q->bindParam(1, $prod_name);
    if ($q->execute())
        return $q->fetch()['pid'];
    return NULL;
}

function ierg4210_prod_fetchOne($prod_id){
    // fetch one particular products identified by pid
    global $db;
    $db = ierg4210_DB();
    $q = $db->prepare("SELECT * FROM products WHERE pid=?;");
    $q->bindParam(1, $prod_id);
    if ($q->execute())
        return $q->fetchAll();
    return NULL;
}

function ierg4210_prod_insert() {
    // input validation or sanitization
    // DB manipulation
    global $db;
    $db = ierg4210_DB();

    if (!preg_match('/^[\w\- ]+$/', $_POST['cat-name']))
        throw new Exception("invalid-name");
    if (!preg_match('/^[\w\- ]+$/', $_POST['prod-name']))
        throw new Exception("invalid-name");
    if (!preg_match('/^[\d\.]+$/', $_POST['price']))
        throw new Exception("invalid-price");
    if (!preg_match('/^[\w\- ]+$/', $_POST['description']))
        throw new Exception("invalid-text");

    // Copy the uploaded file to a folder which can be publicly accessible at incl/img/[pid].jpg
    if ($_FILES["file"]["error"] === 0
        && ($_FILES["file"]["type"] === "image/jpeg" || $_FILES["file"]["type"] === "image/jpg" || $_FILES["file"]["type"] === "image/png" || $_FILES["file"]["type"] === "image/gif")
        && mime_content_type($_FILES["file"]["tmp_name"]) === "image/jpeg" || mime_content_type($_FILES["file"]["tmp_name"]) === "image/jpg" || mime_content_type($_FILES["file"]["tmp_name"]) === "image/png" || mime_content_type($_FILES["file"]["tmp_name"]) === "image/gif"
        && $_FILES["file"]["size"] < 10485760) {

        $catid = (int)(ierg4210_cat_getCatid($_POST['cat-name']));
        $name = $_POST["prod-name"];
        $price = $_POST["price"];
        $desc = $_POST["description"];
        $sql="INSERT INTO products (catid, name, price, description) VALUES (?, ?, ?, ?);";
        $q = $db->prepare($sql);
        $q->bindParam(1, $catid);
        $q->bindParam(2, $name);
        $q->bindParam(3, $price);
        $q->bindParam(4, $desc);
        
        if (($result = $q->execute()) === FALSE) {
            return FALSE;
        }
        $lastId = $db->lastInsertId();

        $extension = "." . explode("/", $_FILES["file"]["type"])[1];

        // Note: Take care of the permission of destination folder (hints: current user is apache)
        // Photo name: pid.extension
        if (move_uploaded_file($_FILES["file"]["tmp_name"], "/var/www/html/admin/lib/images/" . $lastId . $extension)) {
            return TRUE;
        }
        else {
            return FALSE;
        }
    }
    return FALSE;
}

function ierg4210_prod_edit(){
    // Product update action
    global $db;
    $db = ierg4210_DB();

    if (!preg_match('/^[\w\- ]+$/', $_POST['cat-name']))
        throw new Exception("invalid-name");
    if (!preg_match('/^[\w\- ]+$/', $_POST['prod-name']))
        throw new Exception("invalid-name");
    if (!preg_match('/^[\d\.]+$/', $_POST['price']))
        throw new Exception("invalid-price");
    if (!preg_match('/^[\w\- ]+$/', $_POST['description']))
        throw new Exception("invalid-text");
    
        if ($_FILES["file"]["error"] === 0
        && ($_FILES["file"]["type"] === "image/jpeg" || $_FILES["file"]["type"] === "image/jpg" || $_FILES["file"]["type"] === "image/png" || $_FILES["file"]["type"] === "image/gif")
        && mime_content_type($_FILES["file"]["tmp_name"]) === "image/jpeg" || mime_content_type($_FILES["file"]["tmp_name"]) === "image/jpg" || mime_content_type($_FILES["file"]["tmp_name"]) === "image/png" || mime_content_type($_FILES["file"]["tmp_name"]) === "image/gif"
        && $_FILES["file"]["size"] < 10485760) {

            $catid = (int)(ierg4210_cat_getCatid($_POST['cat-name']));
            $pid = (int)(ierg4210_prod_getPid($_POST['name']));
            $name = $_POST['name'];
            $price = $_POST['price'];
            $desc = $_POST['description'];
            
            $sql="UPDATE Products SET catid = ?, name = ?, price = ?, desc = ? WHERE pid = ?;";
            $q = $db->prepare($sql);
            $q->bindParam(1, $catid);
            $q->bindParam(2, $name);
            $q->bindParam(3, $price);
            $q->bindParam(4, $desc);
            $q->execute();
            $lastId = $db->lastInsertId();
            $extension = "";
            if ($_FILES["file"]["type"] == "image/jpeg" || $_FILES["file"]["type"] == "image/jpg")
                $extension = ".jpg";
            else if ($_FILES["file"]["type"] == "image/png")
                $extension = ".png";
            else $extension = ".gif";

            // Note: Take care of the permission of destination folder (hints: current user is apache)
            if (move_uploaded_file($_FILES["file"]["tmp_name"], "/var/www/html/admin/lib/images/" . $lastId . $extension)) {
                return TRUE;
                // exit();
            }
            return FALSE;
    }
}
function ierg4210_prod_delete(){
    // Product delete action
    global $db;
    $db = ierg4210_DB();

    if (!preg_match('/^[\w\- ]+$/', $_POST['prod-name']))
        throw new Exception("invalid-name");
    
    $name = $_POST['prod-name'];
    $pid = ierg4210_prod_getPid($name);

    $extension = array(".jpg", ".jpeg", ".png", ".gif");

    foreach ($exts as $ext) {
        $path = "$pid" . "$ext";
        if (file_exists($path)) {
            if (($res = unlink($path)) === FALSE) {
                return FALSE;
            }
            else break;
        }
    }
    
    $sql="DELETE FROM Products WHERE name = ?;";
    $q = $db->prepare($sql);
    $q->bindParam(1, $name);
    if ($q->execute())
        return TRUE;
    return FALSE;
}
