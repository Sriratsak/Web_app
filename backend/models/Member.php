<?php
class Member {
    private $conn;
    private $table = "user";

    public function __construct($db){
        $this->conn = $db;
    }

    // =========================
    // ✅ REGISTER
    // =========================
    public function register($password, $name, $email, $tel, $role = "user"){
        
        $email = trim($email);
        if(empty($email)){
            return ["success" => false, "message" => "email ว่าง"];
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);

        // 🔥 ✅ แก้ตรงนี้ (id → user_id)
        $check = $this->conn->prepare("SELECT user_id FROM {$this->table} WHERE email = :email");
        $check->bindParam(":email", $email);
        $check->execute();

        if($check->rowCount() > 0){
            return ["success" => false, "message" => "email ซ้ำ"];
        }

        // ✅ insert (อันนี้ถูกอยู่แล้ว)
        $sql = "INSERT INTO {$this->table} (password, name, email, tel, role)
                VALUES (:password, :name, :email, :tel, :role)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":password", $hash);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":tel", $tel);
        $stmt->bindParam(":role", $role);

        if($stmt->execute()){
            return ["success" => true];
        } else {
            return [
                "success" => false,
                "message" => $stmt->errorInfo() // 🔥 debug ได้เลย
            ];
        }
    }

    // =========================
    // ✅ LOGIN
    // =========================
    public function login($password, $email){

        $email = trim($email);

        $sql = "SELECT * FROM {$this->table} WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user && password_verify($password, $user['password'])){
            return ["success" => true, "user" => $user];
        }

        return ["success" => false, "message" => "อีเมลหรือรหัสผ่านผิด"];
    }

    // =========================
    // ✅ GET USER BY ID
    // =========================
    public function getUserById($id){

        // 🔥 แก้ id → user_id
        $sql = "SELECT user_id AS id, name, email, tel, role 
                FROM {$this->table} 
                WHERE user_id = :id LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // =========================
    // ✅ GET ALL USERS
    // =========================
    public function getAllUsers(){

        // 🔥 แก้ user_id ให้ frontend ใช้ id เหมือนเดิม
        $sql = "SELECT user_id AS id, name AS username, email, tel, role FROM {$this->table}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =========================
    // ✅ UPDATE USER
    // =========================
    public function updateUser($id, $name, $role){

        // 🔥 แก้ id → user_id
        $sql = "UPDATE {$this->table} 
                SET name = :name, role = :role 
                WHERE user_id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();
    }

    // =========================
    // ✅ DELETE USER
    // =========================
    public function deleteUser($id){

        // 🔥 แก้ id → user_id
        $sql = "DELETE FROM {$this->table} WHERE user_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();
    }
}
?>