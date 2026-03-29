<?php
class StockIn {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $sql = "SELECT si.*, p.prod_name, u.name AS user_name
                FROM stock_in si
                JOIN product p ON si.prod_id = p.prod_id
                JOIN user u ON si.user_id = u.user_id
                ORDER BY si.stockin_id DESC";
        $rows = $this->conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as &$row) {
    $row['quantity'] = (int)$row['quantity']; // 🔥 แปลงเป็น integer
}
return $rows;
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM stock_in WHERE stockin_id = :id");
        $stmt->execute([":id" => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ✅ แก้ให้ตรง schema จริง (ไม่มี quantity ใน product)
    public function create($prod_id, $quantity, $user_id) {
        try {
            $stmt = $this->conn->prepare("
                INSERT INTO stock_in (prod_id, quantity, date, user_id)
                VALUES (:pid, :qty, CURDATE(), :uid)
            ");
            $stmt->execute([
                ":pid" => $prod_id,
                ":qty" => $quantity,
                ":uid" => $user_id
            ]);
            return ["status" => true, "id" => $this->conn->lastInsertId()];
        } catch (Exception $e) {
            return ["status" => false, "error" => $e->getMessage()];
        }
    }

    public function update($id, $prod_id, $quantity, $user_id, $date) {
        $stmt = $this->conn->prepare("
            UPDATE stock_in SET prod_id=:pid, quantity=:qty, user_id=:uid, date=:date
            WHERE stockin_id=:id
        ");
        return $stmt->execute([
            ":id"   => $id,
            ":pid"  => $prod_id,
            ":qty"  => $quantity,
            ":uid"  => $user_id,
            ":date" => $date
        ]);
    }

    public function delete($id) {
        return $this->conn->prepare("DELETE FROM stock_in WHERE stockin_id=:id")
            ->execute([":id" => $id]);
    }
}