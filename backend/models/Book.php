<?php

class Book {

    private $conn;
    private $table = "books";

    public function __construct($db){
        $this->conn = $db;
    }

    // GET ALL BOOKS
    public function getAll(){

        $sql = "
            SELECT b.book_id, b.book_title, b.author,
                   c.category_name, b.publish_year
            FROM books b
            LEFT JOIN categories c
            ON b.category_id = c.category_id
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

        // GET BOOK by ID
    public function getById($bookid){

        $sql = "
            SELECT b.book_id, b.book_title, b.author,
                   c.category_name, b.publish_year
            FROM books b
            LEFT JOIN categories c
            ON b.category_id = c.category_id
            WHERE b.book_id = :bookid
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":bookid",$bookid);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // CREATE BOOK
    public function create($title,$author,$category,$year){

        $sql = "INSERT INTO books
                (book_title,author,category_id,publish_year)
                VALUES (:title,:author,:category,:year)";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(":title",$title);
        $stmt->bindParam(":author",$author);
        $stmt->bindParam(":category",$category);
        $stmt->bindParam(":year",$year);

        return $stmt->execute();
    }

    // UPDATE BOOK
    public function update($id,$title,$author,$category,$year){

        $sql = "UPDATE books
                SET book_title=:title,
                    author=:author,
                    category_id=:category,
                    publish_year=:year
                WHERE book_id=:id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(":id",$id);
        $stmt->bindParam(":title",$title);
        $stmt->bindParam(":author",$author);
        $stmt->bindParam(":category",$category);
        $stmt->bindParam(":year",$year);

        return $stmt->execute();
    }

    // DELETE BOOK
    public function delete($id){

        $sql = "DELETE FROM books WHERE book_id=:id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id",$id);

        return $stmt->execute();
    }

}
?>