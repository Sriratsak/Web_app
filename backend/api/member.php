<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

require_once "../Database.php";
require_once "../models/Member.php";

$db = (new Database())->getConnection();
$member = new Member($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$data = json_decode(file_get_contents("php://input"), true) ?? [];

// REGISTER
if($method == "POST" && preg_match('#/member.php/register$#', $uri)){
    $result = $member->register(
        $data['password'],
        $data['name'],
        $data['email'],
        $data['tel'],
        $data['role']
    );

    echo json_encode(["success" => $result]);
    exit;
}

// LOGIN
if($method == "POST" && preg_match('#/member.php/login$#', $uri)){
    $user = $member->login($data['password'], $data['email']);

    if($user){
        unset($user['password']);
        echo json_encode([
            "success" => true,
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid login"
        ]);
    }
    exit;
}
?>