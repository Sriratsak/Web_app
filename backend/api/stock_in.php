<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '0');
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../Database.php";
require_once "../models/StockIn.php";

$db = (new Database())->getConnection();
$stock = new StockIn($db);

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? [];

// ✅ เอา user จาก session
$user_id = $_SESSION['user_id'] ?? 1;

// ---------------- GET ----------------
if ($method === "GET") {
    echo json_encode($stock->getAll());
}

// ---------------- POST (เพิ่มข้อมูล) ----------------
if ($method === "POST") {

    if (!isset($data['prod_id']) || !isset($data['quantity'])) {
        echo json_encode(["status" => false, "message" => "ข้อมูลไม่ครบ"]);
        exit;
    }

    $result = $stock->create(
        $data['prod_id'],
        $data['quantity'],
        $user_id
    );

    echo json_encode($result);
}

// ---------------- PUT ----------------
if ($method === "PUT") {
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(["status" => false, "message" => "ไม่มี id"]);
        exit;
    }

    $result = $stock->update(
        $id,
        $data['prod_id'],
        $data['quantity'],
        $user_id,
        $data['date'] ?? date("Y-m-d")
    );

    echo json_encode(["success" => $result]);
}

// ---------------- DELETE ----------------
if ($method === "DELETE") {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        echo json_encode(["status" => false, "message" => "ไม่มี id"]);
        exit;
    }

    echo json_encode([
        "success" => $stock->delete($id)
    ]);
}