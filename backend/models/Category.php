<?php

    class Category {
        private $conn;
        private $table = "categories";

        public function __construct($db){
            $this->conn = $db;
        }

        // GET ALL
        public function getAll(){
            $stmt = $this->conn->prepare(
                "SELECT * FROM ".$this->table
            );
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // CREATE
        public function create($name){
            $sql = "INSERT INTO ".$this->table."
                    (category_name)
                    VALUES(:name)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":name",$name);
            return $stmt->execute();
        }

        // UPDATE
        public function update($id,$name){
            $sql = "UPDATE ".$this->table."
                    SET category_name=:name
                    WHERE category_id=:id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":name",$name);
            $stmt->bindParam(":id",$id);

            return $stmt->execute();
        }

        // DELETE
        public function delete($id){
            $sql = "DELETE FROM ".$this->table."
                    WHERE category_id=:id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id",$id);
            return $stmt->execute();
        }
    }

?>