<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('session.cookie_samesite', 'Lax'); // สำหรับ localhost
ini_set('session.cookie_secure', '0');
ini_set('session.cookie_httponly', '1');
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once "../Database.php";
require_once "../models/Member.php";

$db     = (new Database())->getConnection();
$member = new Member($db);
$method = $_SERVER['REQUEST_METHOD'];
$uri    = $_SERVER['REQUEST_URI'];
$data   = json_decode(file_get_contents("php://input"), true) ?? [];

// Debug ดิบ
error_log("REQUEST URI: $uri");
error_log("REQUEST METHOD: $method");
error_log("POST DATA: " . json_encode($data));

// REGISTER
if ($method == "POST" && strpos($uri, '/member.php/register') !== false) {
    $result = $member->register(
        $data['password'] ?? '',
        $data['name']     ?? '',
        $data['email']    ?? '',
        $data['tel']      ?? '',
        $data['role']     ?? 'user'
    );
    echo json_encode(["success" => $result]);
    exit;
}

// LOGIN
if ($method == "POST" && preg_match('#/member.php/login$#', $uri)) {
    $loginResult = $member->login($data['password'] ?? '', $data['email'] ?? '');
    
    if ($loginResult['success']) {
        $user = $loginResult['user']; // user จริง
        unset($user['password']); // ลบ password ออกจาก array

        $_SESSION['user_id']    = $user['user_id'];
        $_SESSION['user_name']  = $user['name'];
        $_SESSION['user_email'] = $user['email'];

        echo json_encode([
            "success"    => true,
            "user"       => $user,
            "session_id" => session_id()
        ]);
    } else {
        http_response_code(401);
        echo json_encode($loginResult); // ส่ง message จาก login() ไปตรง ๆ
    }
    exit;
}

http_response_code(404);
echo json_encode(["error" => "Route not found"]);