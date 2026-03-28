<?php
    class Borrow {

        private $conn;
        private $table = "borrowings";

        public function __construct($db){
            $this->conn = $db;
        }

        // =====================
        // GET BORROW HISTORY
        // =====================
        public function getAll(){

            $sql = "
            SELECT
            br.borrow_id,
            m.member_name,
            t.title_name,
            i.barcode,
            br.borrow_date,
            br.return_date
            FROM borrowings br
            JOIN members m ON br.member_id = m.member_id
            JOIN book_items i ON br.item_id = i.item_id
            JOIN book_titles t ON i.title_id = t.title_id
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // =====================
        // BORROW BOOK
        // =====================
        public function borrowBook($member_id,$item_id){

            // ตรวจสอบสถานะหนังสือ
            $check = $this->conn->prepare("
                SELECT status 
                FROM book_items
                WHERE item_id = :item_id
            ");

            $check->bindParam(":item_id",$item_id);
            $check->execute();

            $row = $check->fetch(PDO::FETCH_ASSOC);

            if(!$row || $row['status'] != 'available'){
                return false;
            }

            // บันทึกการยืม
            $sql = "
            INSERT INTO borrowings
            (member_id,item_id,borrow_date)
            VALUES (:member,:item,CURDATE())
            ";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(":member",$member_id);
            $stmt->bindParam(":item",$item_id);

            if($stmt->execute()){

                // เปลี่ยนสถานะหนังสือ
                $update = $this->conn->prepare("
                    UPDATE book_items
                    SET status='borrowed'
                    WHERE item_id=:item
                ");

                $update->bindParam(":item",$item_id);
                $update->execute();

                return true;
            }

            return false;
        }

        // =====================
        // RETURN BOOK
        // =====================
        public function returnBook($borrow_id){

            // หา item_id
            $sql = "
            SELECT item_id
            FROM borrowings
            WHERE borrow_id=:id
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id",$borrow_id);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if(!$row) return false;

            $item_id = $row['item_id'];

            // update return date
            $updateBorrow = $this->conn->prepare("
                UPDATE borrowings
                SET return_date = CURDATE()
                WHERE borrow_id=:id
            ");

            $updateBorrow->bindParam(":id",$borrow_id);
            $updateBorrow->execute();

            // update book status
            $updateBook = $this->conn->prepare("
                UPDATE book_items
                SET status='available'
                WHERE item_id=:item
            ");
            $updateBook->bindParam(":item",$item_id);
            return $updateBook->execute();
        }

    }
?>