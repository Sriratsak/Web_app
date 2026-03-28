<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../Database.php";
require_once "../models/product.php";

$db = (new Database())->getConnection();
$product = new Product($db); // ชื่อ class ต้องตรงกับ product.php

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// match id จาก path
$id = null;
if(preg_match('#/api/product.php/([0-9]+)$#', $uri, $m)){
    $id = $m[1];
}

$data = json_decode(file_get_contents("php://input"), true);

// ------------------ GET ------------------
if($method === "GET"){
    if($id){
        echo json_encode($product->getById($id));
    }else{
        echo json_encode($product->getAll());
    }
}

// ------------------ CREATE ------------------
if($method === "POST"){
    $prod_name = $data['prod_name'] ?? '';
    $prod_price = $data['prod_price'] ?? 0;
    $prod_capacity = $data['prod_capacity'] ?? '';
    $cat_id = $data['cat_id'] ?? null;

    $new_id = $product->create($prod_name, $prod_price, $prod_capacity, $cat_id);

    echo json_encode(["success" => $new_id ? true : false, "prod_id" => $new_id]);
}

// ------------------ UPDATE ------------------
if($method === "PUT" && $id){
    $prod_name = $data['prod_name'] ?? '';
    $prod_price = $data['prod_price'] ?? 0;
    $prod_capacity = $data['prod_capacity'] ?? '';
    $cat_id = $data['cat_id'] ?? null;

    $result = $product->update($id, $prod_name, $prod_price, $prod_capacity, $cat_id);
    echo json_encode(["success" => $result]);
}

// ------------------ DELETE ------------------
if($method === "DELETE" && $id){
    $result = $product->delete($id);
    echo json_encode(["success" => $result]);
}
?>