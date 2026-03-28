<?php

class StockOut {

    private $conn;

    public function __construct($db){
        $this->conn = $db;
    }

    public function getAll(){
        $sql = "SELECT so.*, p.prod_name, u.name AS user_name
                FROM stock_out so
                JOIN product p ON so.prod_id = p.prod_id
                JOIN user u ON so.user_id = u.user_id
                ORDER BY so.stockout_id DESC";
        return $this->conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id){
        $stmt = $this->conn->prepare("SELECT * FROM stock_out WHERE stockout_id=:id");
        $stmt->execute([":id"=>$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($prod_id,$quantity,$user_id){

        try {
            $this->conn->beginTransaction();

            // lock row
            $stmt = $this->conn->prepare("
                SELECT quantity FROM product WHERE prod_id=:pid FOR UPDATE
            ");
            $stmt->execute([":pid"=>$prod_id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if(!$row || $row['quantity'] < $quantity){
                throw new Exception("สินค้าไม่พอ");
            }

            // history
            $this->conn->prepare("
                INSERT INTO stock_out (prod_id,quantity,date,user_id)
                VALUES (:pid,:qty,NOW(),:uid)
            ")->execute([
                ":pid"=>$prod_id,
                ":qty"=>$quantity,
                ":uid"=>$user_id
            ]);

            // - stock
            $this->conn->prepare("
                UPDATE product SET quantity = quantity - :qty
                WHERE prod_id = :pid
            ")->execute([
                ":pid"=>$prod_id,
                ":qty"=>$quantity
            ]);

            $this->conn->commit();
            return ["status"=>true];

        } catch(Exception $e){
            $this->conn->rollback();
            return ["error"=>$e->getMessage()];
        }
    }

    public function update($id,$prod_id,$quantity){
        $stmt = $this->conn->prepare("
            UPDATE stock_out SET prod_id=:pid, quantity=:qty WHERE stockout_id=:id
        ");
        return $stmt->execute([
            ":id"=>$id,
            ":pid"=>$prod_id,
            ":qty"=>$quantity
        ]);
    }

    public function delete($id){
        return $this->conn->prepare("DELETE FROM stock_out WHERE stockout_id=:id")
                          ->execute([":id"=>$id]);
    }

}
?>