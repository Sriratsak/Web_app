<?php

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
        $stmt = $this->conn->prepare(
            "SELECT * FROM " . $this->table
        );
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // GET BY ID
    public function getById($id)
    {
        $sql = "SELECT * FROM " . $this->table . "
                WHERE cat_id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // CREATE
    public function create($name)
    {
        $sql = "INSERT INTO " . $this->table . "
                (cat_name)
                VALUES(:name)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":name", $name);
        return $stmt->execute();
    }

    // UPDATE
    public function update($id, $name)
    {
        $sql = "UPDATE " . $this->table . "
                SET cat_name=:name
                WHERE cat_id=:id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();
    }

    // DELETE
    public function delete($id)
    {
        $sql = "DELETE FROM " . $this->table . "
                WHERE cat_id=:id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }
}

?>