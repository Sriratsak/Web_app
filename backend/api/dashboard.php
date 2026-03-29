<?php
// CORS Headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// จัดการ Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../Database.php";
require_once "../models/Dashboard.php"; // 👈 อย่าลืม require ไฟล์ Model

$db = (new Database())->getConnection();
$dashboard = new Dashboard($db);

try {
    // ดึงข้อมูลผ่าน Method ใน Model
    $summary = $dashboard->getSummary();
    $low_stock_list = $dashboard->getLowStockList();
    $recent_activity = $dashboard->getRecentActivity();

    // ส่ง JSON กลับไป (ชื่อ Key ต้องตรงกับที่ React เรียกใช้นะจ๊ะอ้วง)
    echo json_encode([
        "success" => true,
        "summary" => $summary,
        "low_stock_list" => $low_stock_list,
        "recent_activity" => $recent_activity
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "เกิดข้อผิดพลาดจ้าอ้วง: " . $e->getMessage()
    ]);
}