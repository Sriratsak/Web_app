<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '0');
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once "../Database.php";
require_once "../Model/StockIn.php";

$db    = (new Database())->getConnection();
$stock = new StockIn($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri    = $_SERVER['REQUEST_URI'];
$data   = json_decode(file_get_contents("php://input"), true) ?? [];

$id = null;
if (preg_match('#/stock_in\.php/([0-9]+)$#', $uri, $m)) {
    $id = $m[1];
}

// ✅ ดึง user_id จาก session
$user_id = $_SESSION['user_id'] ?? 1;

if ($method == "GET") {
    echo json_encode($id ? $stock->getById($id) : $stock->getAll());
}

if ($method == "POST") {
    $result = $stock->create(
        $data['prod_id']  ?? '',
        $data['quantity'] ?? '',
        $user_id
    );
    echo json_encode($result);
}

if ($method == "PUT" && $id) {
    $result = $stock->update(
        $id,
        $data['prod_id']  ?? '',
        $data['quantity'] ?? '',
        $user_id,
        $data['date'] ?? date("Y-m-d")
    );
    echo json_encode(["success" => $result]);
}

if ($method == "DELETE" && $id) {
    echo json_encode(["success" => $stock->delete($id)]);
}