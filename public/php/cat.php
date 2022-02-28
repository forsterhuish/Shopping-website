<?php
    require __DIR__.'/lib/db.inc.php';
    $res = ierg4210_cat_fetchall();
    foreach ($res as $key=>$value) {
    	$value['catid'] = (int)$value['catid'];
        $obj[$key] = $value;
    }
    echo json_encode($obj);
?>