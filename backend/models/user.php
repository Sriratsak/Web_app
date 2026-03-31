<?php
// ปิด warning/notice
ini_set('display_errors', 0);
error_reporting(0);

// ================= CORS =================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // <-- เพิ่ม Content-Type
header("Content-Type: application/json");

// OPTIONS สำหรับ preflight
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../Database.php";

// สร้าง connection
$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// =======================
// GET: ดึง users
// =======================
// =======================
// GET: ดึง users (แก้ไขบรรทัดที่มี SELECT)
// =======================
if ($method === "GET") {
    try {
        // เพิ่ม status เข้าไปในคำสั่ง SELECT ด้านล่างนี้ครับ
        $stmt = $conn->prepare("SELECT user_id AS id, name AS username, email, tel, role, status FROM user");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// ส่วน PUT ใน user.php
if ($method === "PUT") {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input['id'] ?? null;
    $username = $input['username'] ?? null;
    $email = $input['email'] ?? null;
    $tel = $input['tel'] ?? null;
    $status = $input['status'] ?? null; // รับค่า status เพิ่ม

    try {
        // เพิ่ม status=:status ใน SQL
        $stmt = $conn->prepare("UPDATE user SET name=:username, email=:email, tel=:tel, status=:status WHERE user_id=:id");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':tel', $tel);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit;
}

// =======================
// DELETE: ลบ user พร้อม stock_in/out
// =======================
if ($method === "DELETE") {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(["success" => false, "message" => "Missing id"]);
        exit;
    }

    try {
        // ลบ stock_in ของ user ก่อน
        $stmt = $conn->prepare("DELETE FROM stock_in WHERE user_id=:id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        // ลบ stock_out ของ user ก่อน
        $stmt = $conn->prepare("DELETE FROM stock_out WHERE user_id=:id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        // ลบ user
        $stmt = $conn->prepare("DELETE FROM user WHERE user_id=:id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit;
}
?>