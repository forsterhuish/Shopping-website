<?php
    require __DIR__.'/lib/db.inc.php';
    $res = ierg4210_prod_fetchall();
    $obj = array();
    foreach ($res as $key=>$value) {
    	$value["pid"] = (int)$value["pid"];
    	$value["catid"] = (int)$value["catid"];
    	$value["stock"] = (int)$value["stock"];
    	$value["price"] = (float)$value["price"];
        $obj[$key] = $value;
    }
    echo json_encode($obj);
?>