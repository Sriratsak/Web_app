<?php
session_start();


error_reporting(E_ALL);
ini_set('display_errors', 1);


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../Database.php";
require_once "../models/StockOut.php";

$db = (new Database())->getConnection();
$stock = new StockOut($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];


$id = null;
if(preg_match('#stock_out.php/([0-9]+)$#', $uri, $m)){
    $id = $m[1];
}

$data = json_decode(file_get_contents("php://input"), true) ?? [];

/* ------------------ GET ------------------ */
if($method === "GET"){
    if($id){
        echo json_encode($stock->getById($id));
    } else {
        echo json_encode($stock->getAll());
    }
}

/* ------------------ POST ------------------ */
if($method === "POST"){

    // 🔥 แก้ตรงนี้ให้ใช้ได้เลย (ทดสอบ)
    if(!isset($_SESSION['user_id'])){
        $_SESSION['user_id'] = 1; // 🔥 ใส่ user fake ไปก่อน
    }

    if(empty($data['prod_id']) || empty($data['quantity'])){
        echo json_encode([
            "status"=>false,
            "message"=>"ข้อมูลไม่ครบ"
        ]);
        exit;
    }

    $result = $stock->create(
    $data['prod_id'],
    $data['quantity'],
    $_SESSION['user_id'],
    $data['note'] ?? '' // 🔥 ใส่ note จาก frontend
);

    echo json_encode($result);
}

/* ------------------ PUT ------------------ */
if($method === "PUT" && $id){
    $result = $stock->update(
        $id,
        $data['prod_id'] ?? '',
        $data['quantity'] ?? ''
    );
    echo json_encode(["success"=>$result]);
}

/* ------------------ DELETE ------------------ */
if($method === "DELETE" && $id){
    $result = $stock->delete($id);
    echo json_encode(["success"=>$result]);
}
?>