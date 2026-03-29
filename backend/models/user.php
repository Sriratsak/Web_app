<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "your_db");

// ❗ เช็คการเชื่อมต่อ
if (!$conn) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// =======================
// ✅ GET (ดึงจาก members)
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT 
                id, 
                name AS username,  -- 🔥 map name → username
                email, 
                tel, 
                role 
            FROM members";

    $res = mysqli_query($conn, $sql);

    $data = [];
    while ($row = mysqli_fetch_assoc($res)) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

// =======================
// ✅ PUT (แก้ไข user)
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = json_decode(file_get_contents("php://input"), true);

    $id = $input['id'];
    $username = $input['username'];
    $role = $input['role'];

    $sql = "UPDATE members 
            SET name='$username', role='$role' 
            WHERE id='$id'";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }

    exit;
}
?>