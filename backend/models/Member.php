<?php
    class Member {
        private $conn;
        private $table = "members";

        public function __construct($db){
            $this->conn = $db;
        }

        // REGISTER
        public function register($name, $password, $email, $tel, $role = "user"){
            // hash password
            $hash = password_hash($password, PASSWORD_DEFAULT);

            // ตรวจสอบ email ซ้ำ
            $check = $this->conn->prepare("SELECT user_id FROM User WHERE email = :email");
            $check->bindParam(":email", $email);
            $check->execute();

            if($check->rowCount() > 0){
                // ถ้ามี email แล้ว → ไม่ให้สมัครซ้ำ
                return false;
            }

            // สมัครใหม่
            $sql = "INSERT INTO User (password, name, tel, email, role)
                    VALUES (:password, :name, :tel, :email, :role)";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(":password", $hash);
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":tel", $tel);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":role", $role);

            return $stmt->execute();
        }
        // LOGIN
        public function login($name,$password){
            $sql = "SELECT * FROM members WHERE member_name=:name LIMIT 1";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":name",$name);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if($user && password_verify($password,$user['password'])){
                return $user;
            }
            return false;
        }
    }

?>