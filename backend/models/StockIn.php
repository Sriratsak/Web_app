<?php

class StockIn
{

    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll()
    {
        $sql = "SELECT si.*, p.prod_name, u.name AS user_name
                FROM stock_in si
                JOIN product p ON si.prod_id = p.prod_id
                JOIN user u ON si.user_id = u.user_id
                ORDER BY si.stockin_id DESC";
        return $this->conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM stock_in WHERE stockin_id=:id");
        $stmt->execute([":id" => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($prod_id, $quantity, $user_id)
    {

        try {
            $this->conn->beginTransaction();

            // history
            $this->conn->prepare("
                INSERT INTO stock_in (prod_id,quantity,date,user_id)
                VALUES (:pid,:qty,NOW(),:uid)
            ")->execute([
                        ":pid" => $prod_id,
                        ":qty" => $quantity,
                        ":uid" => $user_id
                    ]);

            // + stock
            $this->conn->prepare("
                UPDATE product SET quantity = quantity + :qty
                WHERE prod_id = :pid
            ")->execute([
                        ":pid" => $prod_id,
                        ":qty" => $quantity
                    ]);

            $this->conn->commit();
            return ["status" => true];

        } catch (Exception $e) {
            $this->conn->rollback();
            return ["error" => $e->getMessage()];
        }
    }

    public function update($id, $prod_id, $quantity)
    {
        $stmt = $this->conn->prepare("
            UPDATE stock_in SET prod_id=:pid, quantity=:qty WHERE stockin_id=:id
        ");
        return $stmt->execute([
            ":id" => $id,
            ":pid" => $prod_id,
            ":qty" => $quantity
        ]);
    }

    public function delete($id)
    {
        return $this->conn->prepare("DELETE FROM stock_in WHERE stockin_id=:id")
            ->execute([":id" => $id]);
    }

}
?>