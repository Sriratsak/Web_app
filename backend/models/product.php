<?php
class Product
{
    private $conn;
    private $table = "product";

    public function __construct($db){
        $this->conn = $db;
    }

    // ดึงสินค้าทั้งหมดพร้อมชื่อหมวดหมู่และจำนวนคงเหลือ
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

    // GET BY ID พร้อมชื่อหมวดหมู่
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

    $stmt->bindValue(":name", $name, PDO::PARAM_STR);
    $stmt->bindValue(":price", $price, PDO::PARAM_STR);
    $stmt->bindValue(":capacity", $capacity, PDO::PARAM_STR);
    if($cat_id === null){
        $stmt->bindValue(":cat_id", null, PDO::PARAM_NULL);
    } else {
        $stmt->bindValue(":cat_id", $cat_id, PDO::PARAM_INT);
    }
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);

    if($stmt->execute()){
        return $this->getById($id); // ส่งกลับสินค้าที่อัปเดตแล้ว
    }
    return false;
}
    // DELETE
    public function delete($id){
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table . " WHERE prod_id=:id");
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    // --- ฟังก์ชันเสริม: ดึงชื่อหมวดหมู่ตาม cat_id ---
    public function getCategoryById($cat_id){
        $stmt = $this->conn->prepare("SELECT cat_name FROM category WHERE cat_id = :cat_id");
        $stmt->bindParam(":cat_id", $cat_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>