<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../Database.php";
require_once "../Model/StockOut.php"; // เรียกใช้ Model StockOut

$db = (new Database())->getConnection();
$stock = new StockOut($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

/* ---------------------------
   match id จาก path
--------------------------- */
$id = null;
if(preg_match('#/api/stock_out.php/([0-9]+)$#', $uri, $m)){
    $id = $m[1];
}

$data = json_decode(file_get_contents("php://input"), true);

/* ---------------------------
   GET
--------------------------- */
if($method == "GET"){
    if($id){
        echo json_encode($stock->getById($id));
    }else{
        echo json_encode($stock->getAll());
    }
}

/* ---------------------------
   POST - บันทึกการเบิกสินค้าออก
--------------------------- */
if($method == "POST"){
    $result = $stock->create(
        $data['prod_id'] ?? '',
        $data['quantity'] ?? '',
        $data['user_id'] ?? 1,
        date("Y-m-d")
    );
    echo json_encode(["success" => $result]);
}

/* ---------------------------
   PUT
--------------------------- */
if($method == "PUT" && $id){
    $result = $stock->update(
        $id,
        $data['prod_id'] ?? '',
        $data['quantity'] ?? '',
        $data['user_id'] ?? 1,
        $data['date'] ?? ''
    );
    echo json_encode(["success" => $result]);
}

/* ---------------------------
   DELETE
--------------------------- */
if($method == "DELETE" && $id){
    $result = $stock->delete($id);
    echo json_encode(["success" => $result]);
}
?>