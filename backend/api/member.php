<?php
ini_set('session.cookie_samesite', 'None');
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

// REGISTER
if ($method == "POST" && preg_match('#/member.php/register$#', $uri)) {
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
    $user = $member->login($data['password'] ?? '', $data['email'] ?? '');

    if ($user) {
        unset($user['password']);
        $_SESSION['user_id']    = $user['user_id'];
        $_SESSION['user_name']  = $user['name'];
        $_SESSION['user_email'] = $user['email'];

        error_log("[LOGIN] success → user_id: {$user['user_id']}, session_id: " . session_id());

        echo json_encode([
            "success"    => true,
            "user"       => $user,
            "session_id" => session_id()
        ]);
    } else {
        error_log("[LOGIN] failed → email: " . ($data['email'] ?? 'ไม่มี'));
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "อีเมลหรือรหัสผ่านไม่ถูกต้อง"]);
    }
    exit;
}

http_response_code(404);
echo json_encode(["error" => "Route not found"]);