<?php
class Dashboard {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getSummary() {
        
        $stmt1 = $this->db->query("SELECT COUNT(*) as total_items FROM product");
        $total_items = $stmt1->fetch(PDO::FETCH_ASSOC)['total_items'];

       
        $stmt2 = $this->db->query("SELECT SUM(prod_price * prod_capacity) as total_value FROM product");
        $total_value = $stmt2->fetch(PDO::FETCH_ASSOC)['total_value'] ?? 0;

        $stmt3 = $this->db->query("SELECT COUNT(*) as low_stock_count FROM product WHERE prod_capacity <= 5");
        $low_stock_count = $stmt3->fetch(PDO::FETCH_ASSOC)['low_stock_count'];

       
        $sql_trans = "SELECT 
            (SELECT COUNT(*) FROM stock_in WHERE DATE(date) = CURDATE()) + 
            (SELECT COUNT(*) FROM stock_out WHERE DATE(date) = CURDATE()) as daily_trans";
        $stmt4 = $this->db->query($sql_trans);
        $daily_trans = $stmt4->fetch(PDO::FETCH_ASSOC)['daily_trans'];

        return [
            "total_items" => (int)$total_items,
            "total_value" => (float)$total_value,
            "low_stock_count" => (int)$low_stock_count,
            "daily_trans" => (int)$daily_trans
        ];
    }

    public function getLowStockList() {
        $stmt = $this->db->query("SELECT prod_name, prod_capacity FROM product WHERE prod_capacity <= 5 ORDER BY prod_capacity ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getRecentActivity() {
        // ดึงรายการ รับเข้า และ เบิกออก ที่เกิดขึ้นในวันนี้
        $sql = "
            SELECT 'in' as type, p.prod_name, s.quantity, s.date 
            FROM stock_in s 
            JOIN product p ON s.prod_id = p.prod_id 
            WHERE DATE(s.date) = CURDATE()
            
            UNION ALL
            
            SELECT 'out' as type, p.prod_name, s.quantity, s.date 
            FROM stock_out s 
            JOIN product p ON s.prod_id = p.prod_id 
            WHERE DATE(s.date) = CURDATE()
            
            ORDER BY date DESC
        ";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}