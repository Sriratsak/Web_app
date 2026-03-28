<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../Database.php";
require_once "../models/category.php"; // ต้องมี class Category

$db = (new Database())->getConnection();
$category = new Category($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// match id จาก path เช่น /api/category.php/3
$id = null;
if(preg_match('#/api/category.php/([0-9]+)$#', $uri, $m)){
    $id = $m[1];
}

$data = json_decode(file_get_contents("php://input"), true);

// ------------------ GET ------------------
if($method === "GET"){
    if($id){
        echo json_encode($category->getById($id));
    } else {
        echo json_encode($category->getAll());
    }
}

// ------------------ CREATE ------------------
if($method === "POST"){
    $name = $data['cat_name'] ?? '';

    $new_id = $category->create($name);

    echo json_encode(["success" => $new_id ? true : false, "cat_id" => $new_id]);
}

// ------------------ UPDATE ------------------
if($method === "PUT" && $id){
    $name = $data['cat_name'] ?? '';

    $result = $category->update($id, $name);
    echo json_encode(["success" => $result]);
}

// ------------------ DELETE ------------------
if($method === "DELETE" && $id){
    $result = $category->delete($id);
    echo json_encode(["success" => $result]);
}
?>