<?php

header("Content-Type: application/json");

require_once "../Database.php";
require_once "../Model/Member.php";

$db = (new Database())->getConnection();
$member = new Member($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

$data = json_decode(file_get_contents("php://input"), true) ?? [];

/* =========================
   REGISTER
   POST /API/member.php/register
========================= */
if($method == "POST" && preg_match('#/api/member.php/register$#',$uri)){

    $result = $member->register(
        $data['user_id'],
        $data['password'],
        $data['name'],
        $data['tel'],
        $data['email'],
        $data['role']
    );

    echo json_encode([
        "success"=>$result
    ]);

    exit;
}

/* =========================
   LOGIN
   POST /API/member.php/login
========================= */
if($method == "POST" && preg_match('#/api/member.php/login$#',$uri)){

    $user = $member->login(
        $data['member_name'],
        $data['password']
    );

    if($user){

        unset($user['password']);

        echo json_encode([
            "success"=>true,
            "user"=>$user
        ]);

    }else{

        echo json_encode([
            "success"=>false,
            "message"=>"Invalid login"
        ]);

    }

    exit;
}