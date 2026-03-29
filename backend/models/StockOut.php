<?php

class StockOut
{

    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // ✅ ดึงข้อมูลทั้งหมด
    public function getAll()
    {
        $sql = "SELECT so.*, p.prod_name, u.name AS user_name
                FROM stock_out so
                JOIN product p ON so.prod_id = p.prod_id
                JOIN user u ON so.user_id = u.user_id
                ORDER BY so.stockout_id DESC";
        return $this->conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // ✅ ดึงข้อมูลตาม id
    public function getById($id)
    {
        $stmt = $this->conn->prepare("
            SELECT so.*, p.prod_name, u.name AS user_name
            FROM stock_out so
            JOIN product p ON so.prod_id = p.prod_id
            JOIN user u ON so.user_id = u.user_id
            WHERE so.stockout_id = :id
        ");
        $stmt->execute([":id" => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 🔥 ฟังก์ชันสำคัญ: เบิกสินค้า
    public function create($prod_id, $quantity, $user_id)
    {
        try {

            // 🔥 เริ่ม transaction
            $this->conn->beginTransaction();

            // 1. เช็ค stock ปัจจุบันจาก product
            $stmt = $this->conn->prepare("
            SELECT prod_capacity 
            FROM product 
            WHERE prod_id = :pid
        ");
            $stmt->execute([":pid" => $prod_id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $currentStock = (int) $row['prod_capacity'];

            // ❗ กันของติดลบ
            if ($quantity > $currentStock) {
                return [
                    "error" => "สินค้าไม่พอ (เหลือ " . $currentStock . ")"
                ];
            }

            // 2. insert stock_out
            $stmt = $this->conn->prepare("
            INSERT INTO stock_out (prod_id, quantity, date, user_id)
            VALUES (:pid, :qty, NOW(), :uid)
        ");
            $stmt->execute([
                ":pid" => $prod_id,
                ":qty" => $quantity,
                ":uid" => $user_id
            ]);

            // 🔥 3. ลด stock ใน product
            $stmt = $this->conn->prepare("
            UPDATE product 
            SET prod_capacity = prod_capacity - :qty
            WHERE prod_id = :pid
        ");
            $stmt->execute([
                ":qty" => $quantity,
                ":pid" => $prod_id
            ]);

            // 🔥 commit
            $this->conn->commit();

            return ["success" => true];

        } catch (Exception $e) {

            // ❌ ถ้ามี error rollback
            $this->conn->rollBack();

            return [
                "error" => $e->getMessage()
            ];
        }
    }

    // ✅ update
    public function update($id, $prod_id, $quantity)
    {
        $stmt = $this->conn->prepare("
            UPDATE stock_out 
            SET prod_id=:pid, quantity=:qty 
            WHERE stockout_id=:id
        ");
        return $stmt->execute([
            ":id" => $id,
            ":pid" => $prod_id,
            ":qty" => $quantity
        ]);
    }

    // ✅ ลบ
    public function delete($id)
    {
        return $this->conn->prepare("
            DELETE FROM stock_out WHERE stockout_id=:id
        ")->execute([":id" => $id]);
    }

}
?>