<?php
header("Access-Control-Allow-Origin: *"); // อนุญาตทุก origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// ส่วนโค้ดของคุณต่อ
class Category
{
    private $conn;
    private $table = "category";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // GET ALL
    public function getAll()
    {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // GET BY ID
    public function getById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table . " WHERE cat_id=:id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // CREATE
    public function create($name)
    {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table . " (cat_name) VALUES(:name)");
        $stmt->bindParam(":name", $name);
        if($stmt->execute()){
            return $this->conn->lastInsertId(); // return id ใหม่
        }
        return false;
    }

    // UPDATE
    public function update($id, $name)
    {
        $stmt = $this->conn->prepare("UPDATE " . $this->table . " SET cat_name=:name WHERE cat_id=:id");
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    // DELETE
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table . " WHERE cat_id=:id");
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }
}
?>