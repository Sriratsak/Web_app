<?php
    class Member {
        private $conn;
        private $table = "members";

        public function __construct($db){
            $this->conn = $db;
        }

        // REGISTER
public function register($name,$password,$email,$phone){
    $hash = password_hash($password,PASSWORD_DEFAULT);

    // ตรวจว่ามี email เดิมไหม
    $check = $this->conn->prepare("SELECT member_id,register_count FROM members WHERE email=:email");
    $check->bindParam(":email",$email);
    $check->execute();
    $row = $check->fetch(PDO::FETCH_ASSOC);

    if($row){
        $count = $row['register_count'] + 1;
        $sql = "UPDATE members
                SET member_name=:name,
                    password=:password,
                    phone=:phone,
                    register_date=CURDATE(),
                    leave_date=NULL,
                    register_count=:count,
                    status='active'
                WHERE email=:email";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(":name",$name);
        $stmt->bindParam(":password",$hash);
        $stmt->bindParam(":phone",$phone);
        $stmt->bindParam(":count",$count);
        $stmt->bindParam(":email",$email);

        return $stmt->execute();
    }

    // สมัครใหม่
    $sql = "INSERT INTO members
            (member_name,password,email,phone,register_date)
            VALUES (:name,:password,:email,:phone,CURDATE())";

    $stmt = $this->conn->prepare($sql);

    $stmt->bindParam(":name",$name);
    $stmt->bindParam(":password",$hash);
    $stmt->bindParam(":email",$email);
    $stmt->bindParam(":phone",$phone);

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

        // CHANGE PASSWORD
        public function changePassword($id,$old,$new){
            $sql = "SELECT password FROM members WHERE member_id=:id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id",$id);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row) return false;

            if(!password_verify($old,$row['password'])) return false;
            $hash = password_hash($new,PASSWORD_DEFAULT);

            $sql = "UPDATE members SET password=:password WHERE member_id=:id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":password",$hash);
            $stmt->bindParam(":id",$id);

            return $stmt->execute();
        }

        // GET MEMBERS
       public function getMembers(){
            $stmt = $this->conn->prepare("
                SELECT 
                member_id, member_name,
                email, phone,
                register_date, register_count
                FROM members
                WHERE status='active'
            ");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // UPDATE MEMBER
        public function update($id,$name,$email,$phone){
            $sql = "UPDATE members
                    SET member_name=:name,
                        email=:email,
                        phone=:phone
                    WHERE member_id=:id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id",$id);
            $stmt->bindParam(":name",$name);
            $stmt->bindParam(":email",$email);
            $stmt->bindParam(":phone",$phone);
            return $stmt->execute();
        }

        // DELETE
        public function delete($id){
            $sql = "UPDATE members SET status='inactive', leave_date=CURDATE() WHERE member_id=:id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id",$id);
            return $stmt->execute();
        }
    }

?>