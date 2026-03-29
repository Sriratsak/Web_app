<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '0');
ini_set('session.cookie_httponly', '1');
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// Debug log
error_log("[CURRENT_USER] session_id: " . session_id());
error_log("[CURRENT_USER] _SESSION: " . json_encode($_SESSION));

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "loggedIn"   => true,
        "session_id" => session_id(),
        "user" => [
            "id"    => $_SESSION['user_id'],
            "name"  => $_SESSION['user_name'],
            "email" => $_SESSION['user_email']
        ]
    ]);
} else {
    error_log("[CURRENT_USER] ไม่มี session → loggedIn: false");
    echo json_encode([
        "loggedIn"   => false,
        "session_id" => session_id(),
        "debug"      => "ไม่พบ user_id ใน session"
    ]);
}