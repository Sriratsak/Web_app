<?php

class Product {

    private $conn;
    private $table = "product";

    public function __construct($db){
        $this->conn = $db;
    }

    public function getAll(){
        $sql = "
            SELECT p.*, c.cat_name
            FROM product p
            LEFT JOIN category c ON p.cat_id = c.cat_id
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($name,$price,$capacity,$cat_id){
        $sql = "INSERT INTO product
                (prod_name,prod_price,prod_capacity,cat_id)
                VALUES (:name,:price,:capacity,:cat)";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(":name",$name);
        $stmt->bindParam(":price",$price);
        $stmt->bindParam(":capacity",$capacity);
        $stmt->bindParam(":cat",$cat_id);

        return $stmt->execute();
    }

}
?>