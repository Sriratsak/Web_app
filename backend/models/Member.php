<?php
class Member
{
    private $conn;
    private $table_name = "user";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // ---------------------------------------------------------
    // REGISTER: เพิ่ม status ให้เป็น 'active' โดยอัตโนมัติ
    // ---------------------------------------------------------
    public function register($password, $name, $email, $tel, $role = 'user')
    {
        // เช็คว่าอีเมลซ้ำไหม
        $check = $this->conn->prepare("SELECT email FROM " . $this->table_name . " WHERE email = ?");
        $check->execute([$email]);
        if ($check->rowCount() > 0)
            return false;

        $query = "INSERT INTO " . $this->table_name . " (name, email, password, tel, role, status) VALUES (?, ?, ?, ?, ?, 'active')";
        $stmt = $this->conn->prepare($query);

        // แนะนำให้ใช้ password_hash เพื่อความปลอดภัยนะครับ
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        return $stmt->execute([$name, $email, $hashed_password, $tel, $role]);
    }

    // ---------------------------------------------------------
    // LOGIN: เพิ่มการเช็ค status ว่าต้องเป็น 'active' เท่านั้น
    // ---------------------------------------------------------
    public function login($password, $email)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // 1. เช็ครหัสผ่านก่อนเป็นอันดับแรก!
            // ถ้าใช้ password_hash: if (password_verify($password, $user['password']))
            // ถ้าเก็บรหัสตรงๆ: if ($password === $user['password'])
            if (password_verify($password, $user['password'])) {

                // 2. ถ้ารหัสผ่านถูกค่อยมาเช็คว่า "โดนระงับ" หรือไม่
                if ($user['status'] === 'suspended') {
                    return [
                        "success" => false,
                        "message" => "บัญชีของคุณถูกระงับการใช้งาน"
                    ];
                }

                // ถ้ารหัสถูกและไม่โดนระงับ ก็ให้ผ่าน
                return ["success" => true, "user" => $user];

            } else {
                // ถ้ารหัสผ่านไม่ตรง
                return ["success" => false, "message" => "รหัสผ่านไม่ถูกต้อง"];
            }
        }

        // ถ้าไม่พบอีเมลในระบบ
        return ["success" => false, "message" => "ไม่พบข้อมูลผู้ใช้นี้"];
    }
}