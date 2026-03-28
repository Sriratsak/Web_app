<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../Database.php";

$db = (new Database())->getConnection();
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    
    // 1. รับค่าจาก Frontend
    $prod_id = $data['prod_id'] ?? null;
    $quantity = $data['quantity'] ?? 0;
    $user_id = $data['user_id'] ?? 1; // สมมติ user_id หรือรับจาก session/token
    $date = date("Y-m-d H:i:s");

    if (!$prod_id || $quantity <= 0) {
        echo json_encode(["success" => false, "message" => "ข้อมูลไม่ครบถ้วน"]);
        exit;
    }

    try {
        // เริ่มต้น Transaction เพื่อป้องกันข้อมูลบันทึกไม่ครบ
        $db->beginTransaction();

        // ขั้นตอนที่ 1: บันทึกลงตาราง stock_in
        $stmt1 = $db->prepare("INSERT INTO stock_in (date, user_id) VALUES (?, ?)");
        $stmt1->execute([$date, $user_id]);
        $stockin_id = $db->lastInsertId(); // ดึง ID ที่เพิ่ง insert ไป

        // ขั้นตอนที่ 2: บันทึกรายละเอียดลง stock_in_detail
        $stmt2 = $db->prepare("INSERT INTO stock_in_detail (stockin_id, prod_id, quantity) VALUES (?, ?, ?)");
        $stmt2->execute([$stockin_id, $prod_id, $quantity]);

        // ขั้นตอนที่ 3: อัปเดตจำนวนสินค้าในตาราง product (สมมติว่ามีฟิลด์ qty ในตาราง product)
        // ถ้าเป็น stock_in ใช้ +, ถ้าเป็น stock_out ใช้ -
        $stmt3 = $db->prepare("UPDATE product SET qty = qty + ? WHERE prod_id = ?");
        $stmt3->execute([$quantity, $prod_id]);

        // ถ้าทุกอย่างถูกต้อง ให้ยืนยันการบันทึก
        $db->commit();
        echo json_encode(["success" => true, "message" => "บันทึกข้อมูลเรียบร้อยแล้ว"]);

    } catch (Exception $e) {
        // หากเกิดข้อผิดพลาด ให้ยกเลิกคำสั่งทั้งหมดที่ทำมา (Rollback)
        $db->rollBack();
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
}
?>