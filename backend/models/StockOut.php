<?php

class StockOut {

    private $conn;

    public function __construct($db){
        $this->conn = $db;
    }

    // ✅ ดึงข้อมูลทั้งหมด
    public function getAll(){
        $sql = "SELECT so.*, p.prod_name, u.name AS user_name
                FROM stock_out so
                JOIN product p ON so.prod_id = p.prod_id
                JOIN user u ON so.user_id = u.user_id
                ORDER BY so.stockout_id DESC";
        return $this->conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // ✅ ดึงข้อมูลตาม id
    public function getById($id){
        $stmt = $this->conn->prepare("
            SELECT so.*, p.prod_name, u.name AS user_name
            FROM stock_out so
            JOIN product p ON so.prod_id = p.prod_id
            JOIN user u ON so.user_id = u.user_id
            WHERE so.stockout_id = :id
        ");
        $stmt->execute([":id"=>$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 🔥 ฟังก์ชันสำคัญ: เบิกสินค้า
    public function create($prod_id, $quantity, $user_id){
        try {

            // ✅ คำนวณ stock แบบไม่เพี้ยน
            $stmt = $this->conn->prepare("
                SELECT 
                    IFNULL(si.total_in,0) - IFNULL(so.total_out,0) AS stock
                FROM product p
                LEFT JOIN (
                    SELECT prod_id, SUM(quantity) AS total_in
                    FROM stock_in
                    GROUP BY prod_id
                ) si ON p.prod_id = si.prod_id
                LEFT JOIN (
                    SELECT prod_id, SUM(quantity) AS total_out
                    FROM stock_out
                    GROUP BY prod_id
                ) so ON p.prod_id = so.prod_id
                WHERE p.prod_id = :pid
            ");

            $stmt->execute([":pid"=>$prod_id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $currentStock = $row['stock'] ?? 0;

            // ❗ เช็คของพอไหม
            if($quantity > $currentStock){
                return [
                    "error" => "สินค้าไม่พอ (เหลือ ".$currentStock.")"
                ];
            }

            // ✅ บันทึกการเบิก
            $stmt = $this->conn->prepare("
                INSERT INTO stock_out (prod_id, quantity, date, user_id)
                VALUES (:pid, :qty, NOW(), :uid)
            ");

            $stmt->execute([
                ":pid"=>$prod_id,
                ":qty"=>$quantity,
                ":uid"=>$user_id
            ]);

            return ["success"=>true];

        } catch(Exception $e){
            return [
                "error"=>$e->getMessage()
            ];
        }
    }

    // ✅ update
    public function update($id,$prod_id,$quantity){
        $stmt = $this->conn->prepare("
            UPDATE stock_out 
            SET prod_id=:pid, quantity=:qty 
            WHERE stockout_id=:id
        ");
        return $stmt->execute([
            ":id"=>$id,
            ":pid"=>$prod_id,
            ":qty"=>$quantity
        ]);
    }

    // ✅ ลบ
    public function delete($id){
        return $this->conn->prepare("
            DELETE FROM stock_out WHERE stockout_id=:id
        ")->execute([":id"=>$id]);
    }

}
?>