<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once "../Database.php";
require_once "../models/Dashboard.php";

$db = (new Database())->getConnection();
$dashboard = new Dashboard($db);

try {
    // เรียกใช้ Method จาก Class Dashboard
    $summary = $dashboard->getSummary();
    $low_stock_list = $dashboard->getLowStockList();
    $recent_activity = $dashboard->getRecentActivity();

    echo json_encode([
        "success" => true,
        "summary" => $summary,
        "low_stock_list" => $low_stock_list,
        "recent_activity" => $recent_activity
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}