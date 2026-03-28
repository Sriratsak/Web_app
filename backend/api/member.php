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
        $data['member_name'],
        $data['password'],
        $data['email'],
        $data['phone']
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

/* =========================
   CHANGE PASSWORD
   POST /API/member.php/change-password
========================= */
if($method == "POST" && preg_match('#/api/member.php/change-password$#',$uri)){

    $result = $member->changePassword(
        $data['member_id'],
        $data['old_password'],
        $data['new_password']
    );

    echo json_encode([
        "success"=>$result
    ]);

    exit;
}

/* =========================
   GET MEMBERS
   GET /API/member.php/members
========================= */
if($method == "GET" && preg_match('#/api/member.php/members$#',$uri)){

    echo json_encode(
        $member->getMembers()
    );

    exit;
}

/* =========================
   UPDATE MEMBER
   PUT /API/member.php/members/{id}
========================= */
if($method == "PUT" && preg_match('#/api/member.php/members/([0-9]+)$#',$uri,$m)){

    $id = $m[1];

    $result = $member->update(
        $id,
        $data['member_name'],
        $data['email'],
        $data['phone']
    );

    echo json_encode([
        "success"=>$result
    ]);

    exit;
}

/* =========================
   DELETE MEMBER
   DELETE /API/member.php/members/{id}
========================= */
if($method == "DELETE" && preg_match('#/api/member.php/members/([0-9]+)$#',$uri,$m)){

    $id = $m[1];

    $result = $member->delete($id);

    echo json_encode([
        "success"=>$result
    ]);

    exit;
}

/* =========================
   API NOT FOUND
========================= */

echo json_encode([
    "message"=>"API not found"
]);