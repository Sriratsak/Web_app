<?php
class Member {
    private $conn;
    private $table = "user";

    public function __construct($db){
        $this->conn = $db;
    }

    // REGISTER
    public function register($password, $name, $email, $tel, $role = "user"){
        $hash = password_hash($password, PASSWORD_DEFAULT);

        // ตรวจสอบ email ซ้ำ
        $check = $this->conn->prepare("SELECT user_id FROM user WHERE email = :email");
        $check->bindParam(":email", $email);
        $check->execute();

        if($check->rowCount() > 0){
            return false; // email มีอยู่แล้ว
        }

        $sql = "INSERT INTO user (password, name, email, tel, role)
                VALUES (:password, :name, :email, :tel, :role)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":password", $hash);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":tel", $tel);
        $stmt->bindParam(":role", $role);

        return $stmt->execute();
    }

    // LOGIN
    public function login($password, $email){
        $sql = "SELECT * FROM user WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user && password_verify($password, $user['password'])){
            return $user;
        }

        return false;
    }
}
?>