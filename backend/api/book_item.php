<?php
    header("Content-Type: application/json");

    require_once "../Database.php";
    require_once "../model/BookItem.php";

    $db = (new Database())->getConnection();
    $item = new BookItem($db);

    $method = $_SERVER['REQUEST_METHOD'];
    $uri = $_SERVER['REQUEST_URI'];
    $id = null;
    if(preg_match('#/api/book_item.php/([0-9]+)$#', $uri, $m)){
        $id = $m[1];
    }

    $data = json_decode(file_get_contents("php://input"), true);

    /* GET */
if($method == "GET"){

    if($id){
        echo json_encode($item->getById($id));
    }else{
        echo json_encode($item->getAll());
    }

}

    /* CREATE */
    if($method == "POST"){
        $result = $item->create(
            $data['book_id'],
            $data['barcode']
        );

        echo json_encode(["success"=>$result]);
    }

    /* UPDATE STATUS */
    if($method == "PUT"){
        $result = $item->updateStatus(
            $id,
            $data['status']
        );

        echo json_encode(["success"=>$result]);
    }

    /* DELETE */
    if($method == "DELETE"){
        $result = $item->delete($id);
        echo json_encode(["success"=>$result]);
    }