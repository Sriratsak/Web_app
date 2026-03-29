<?php
class Product
{
    private $conn;
    private $table = "product";

    public function __construct($db){
        $this->conn = $db;
    }

public function getAll(){
    $stmt = $this->conn->prepare("
        SELECT 
            p.*,
            c.cat_name,
            IFNULL(si.total_in,0) - IFNULL(so.total_out,0) AS quantity

        FROM product p
        LEFT JOIN category c ON p.cat_id = c.cat_id

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
    ");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
    // GET BY ID
    public function getById($id){
        $stmt = $this->conn->prepare("
            SELECT p.*, c.cat_name
            FROM " . $this->table . " p
            LEFT JOIN category c ON p.cat_id = c.cat_id
            WHERE p.prod_id = :id
        ");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // CREATE
    public function create($name, $price, $capacity, $cat_id){
        $stmt = $this->conn->prepare("
            INSERT INTO " . $this->table . " (prod_name, prod_price, prod_capacity, cat_id)
            VALUES(:name, :price, :capacity, :cat_id)
        ");
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":price", $price);
        $stmt->bindParam(":capacity", $capacity);
        $stmt->bindParam(":cat_id", $cat_id);
        if($stmt->execute()){
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // UPDATE
    public function update($id, $name, $price, $capacity, $cat_id){
        $stmt = $this->conn->prepare("
            UPDATE " . $this->table . " 
            SET prod_name=:name, prod_price=:price, prod_capacity=:capacity, cat_id=:cat_id
            WHERE prod_id=:id
        ");
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":price", $price);
        $stmt->bindParam(":capacity", $capacity);
        $stmt->bindParam(":cat_id", $cat_id);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    // DELETE
    public function delete($id){
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table . " WHERE prod_id=:id");
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }
}
?>