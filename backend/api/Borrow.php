<?php

header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../models/Borrow.php";

$db = (new Database())->connect();
$borrow = new Borrow($db);

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

$data = json_decode(file_get_contents("php://input"), true);

/* GET BORROW HISTORY */
if($method == "GET"){
    echo json_encode($borrow->getAll());
}

/* BORROW BOOK */
if($method == "POST"){
    $result = $borrow->borrowBook(
        $data['member_id'],
        $data['item_id']
    );

    echo json_encode(["success"=>$result]);
}

/* RETURN BOOK */
if($method == "PUT"){
    $result = $borrow->returnBook($id);
    echo json_encode(["success"=>$result]);
}