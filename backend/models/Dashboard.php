<?php

class Dashboard {

    private $conn;

    public function __construct($db){
        $this->conn = $db;
    }

    // STOCK SUMMARY
    public function stockSummary(){

        $sql = "
            SELECT 
                p.prod_id,
                p.prod_name,

                IFNULL(SUM(si.quantity),0) AS stock_in,
                IFNULL(SUM(so.quantity),0) AS stock_out,

                (IFNULL(SUM(si.quantity),0) - IFNULL(SUM(so.quantity),0)) AS stock

            FROM product p

            LEFT JOIN stock_in_detail si 
                ON p.prod_id = si.prod_id

            LEFT JOIN stock_out_detail so 
                ON p.prod_id = so.prod_id

            GROUP BY p.prod_id
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
?>