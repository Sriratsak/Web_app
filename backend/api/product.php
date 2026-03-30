<?php
// --- ส่วนของ CORS Headers ---
// ถ้าใช้ Session ต้องระบุ URL แทน *
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// 🔥 สำคัญมาก: ดัก OPTIONS แล้วตอบ 200 ทันที
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../Database.php";
require_once "../models/product.php"; // ตรวจสอบตัวเล็กตัวใหญ่ของชื่อไฟล์ด้วยนะ

$db = (new Database())->getConnection();
$product = new Product($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Match ID จาก Path
$id = $_GET['id'] ?? null;
if(preg_match('#/product.php/([0-9]+)$#', $uri, $m)){
    $id = $m[1];
}

// ป้องกันกรณีส่ง Data มาว่างเปล่า
$data = json_decode(file_get_contents("php://input"), true) ?? [];

// ------------------ GET ------------------
if($method === "GET"){
    if($id){
        $result = $product->getById($id);
        echo json_encode($result ? $result : ["message" => "ไม่พบสินค้า"]);
    }else{
       $data = $product->getAll();

// 🔥 บังคับให้ quantity เป็น number + กันติดลบ
foreach ($data as &$row) {
    $row['quantity'] = max(0, (int)$row['quantity']);
}

echo json_encode($data);
    }
}

// ------------------ POST ------------------
if($method === "POST" && !$id){
    $prod_name = $data['prod_name'] ?? '';
    $prod_price = $data['prod_price'] ?? 0;
    $prod_capacity = $data['prod_capacity'] ?? '';
    $cat_id = $data['cat_id'] ?? null;

    if(!empty($prod_name)){
        $new_id = $product->create($prod_name, $prod_price, $prod_capacity, $cat_id);
        echo json_encode(["success" => $new_id ? true : false, "prod_id" => $new_id]);
    } else {
        echo json_encode(["success" => false, "message" => "กรุณาใส่ชื่อสินค้า"]);
    }
}

// ------------------ PUT ------------------
if($method === "PUT" && $id){
    $prod_name = $data['prod_name'] ?? '';
    $prod_price = $data['prod_price'] ?? 0;
    $prod_capacity = $data['prod_capacity'] ?? '';
    $cat_id = $data['cat_id'] ?? null;

    $result = $product->update($id, $prod_name, $prod_price, $prod_capacity, $cat_id);

    if($result){
        // ดึงสินค้าที่อัปเดตแล้ว พร้อม cat_name
        $updatedProduct = $product->getById($id);
        echo json_encode(["success" => true, "product" => $updatedProduct]);
    } else {
        echo json_encode(["success" => false, "message" => "แก้ไขสินค้าไม่สำเร็จ"]);
    }
}

// ------------------ DELETE ------------------
if($method === "DELETE" && $id){
    $result = $product->delete($id);
    echo json_encode(["success" => $result]);
}
?>