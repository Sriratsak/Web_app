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

error_log("[LOGOUT] session_id ก่อน destroy: " . session_id());

session_unset();
session_destroy();

echo json_encode(["success" => true]);