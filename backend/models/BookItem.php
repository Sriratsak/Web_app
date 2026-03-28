<?php

class BookItem {

    private $conn;
    private $table = "book_items";

    public function __construct($db){
        $this->conn = $db;
    }

    /* =========================
       GET ALL BOOK ITEMS
    ========================= */
    public function getAll(){

        try{

            $sql = "
            SELECT
                i.item_id,
                b.book_title,
                i.barcode,
                i.status
            FROM {$this->table} i
            JOIN books b
                ON i.book_id = b.book_id
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        }catch(PDOException $e){
            return ["error"=>$e->getMessage()];
        }

    }

    /* =========================
       GET ITEM BY ID
    ========================= */
    public function getById($item_id){

        try{

            $sql = "
            SELECT
                i.item_id,
                b.book_title,
                i.barcode,
                i.status
            FROM {$this->table} i
            JOIN books b
                ON i.title_id = b.book_id
            WHERE i.item_id = :item_id
            ";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(
                ":item_id",
                $item_id,
                PDO::PARAM_INT
            );

            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        }catch(PDOException $e){
            return ["error"=>$e->getMessage()];
        }

    }

    /* =========================
       GET ITEMS BY BOOK
    ========================= */
    public function getByTitle($title_id){

        try{

            $sql = "
            SELECT
                item_id,
                barcode,
                status
            FROM {$this->table}
            WHERE title_id = :title_id
            ";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(
                ":title_id",
                $title_id,
                PDO::PARAM_INT
            );

            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        }catch(PDOException $e){
            return ["error"=>$e->getMessage()];
        }

    }

    /* =========================
       CREATE BOOK COPY
    ========================= */
    public function create($book_id,$barcode){

        try{
            $sql = "
            INSERT INTO {$this->table}
            (book_id,barcode,status)
            VALUES (:book_id,:barcode,'available')
            ";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":book_id", $book_id, PDO::PARAM_INT);
            $stmt->bindParam(":barcode",$barcode,  PDO::PARAM_STR);
            
            return $stmt->execute();

        }catch(PDOException $e){
            return ["error"=>$e->getMessage()];
        }

    }

    /* =========================
       UPDATE STATUS
    ========================= */
    public function updateStatus($item_id,$status){

        try{

            $sql = "
            UPDATE {$this->table}
            SET status = :status
            WHERE item_id = :item_id
            ";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(
                ":status",
                $status,
                PDO::PARAM_STR
            );

            $stmt->bindParam(
                ":item_id",
                $item_id,
                PDO::PARAM_INT
            );

            return $stmt->execute();

        }catch(PDOException $e){
            return ["error"=>$e->getMessage()];
        }

    }

    /* =========================
       DELETE ITEM
    ========================= */
    public function delete($item_id){

        try{

            $sql = "
            DELETE FROM {$this->table}
            WHERE item_id = :item_id
            ";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(
                ":item_id",
                $item_id,
                PDO::PARAM_INT
            );

            return $stmt->execute();

        }catch(PDOException $e){
            return ["error"=>$e->getMessage()];
        }

    }

}