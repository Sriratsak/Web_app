<?php
class Dashboard {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // ดึงข้อมูลสรุปยอด (Summary)
    public function getSummary() {
        $today = date('Y-m-d');

        // 1. จำนวนรายการสินค้าทั้งหมด
        $stmt1 = $this->db->query("SELECT COUNT(*) as total_items FROM product");
        $total_items = $stmt1->fetch(PDO::FETCH_ASSOC)['total_items'];

        // 2. มูลค่าคงคลัง (Sum prod_price) 
        // 💡 อ้วงจ๋า ถ้าจะให้แม่นยำจริงๆ ปกติต้อง SUM(prod_price * prod_capacity) นะจ๊ะ
        $stmt2 = $this->db->query("SELECT SUM(prod_price) as total_value FROM product");
        $total_value = $stmt2->fetch(PDO::FETCH_ASSOC)['total_value'] ?? 0;

        // 3. สินค้าใกล้หมด (prod_capacity <= 5)
        $stmt3 = $this->db->query("SELECT COUNT(*) as low_stock_count FROM product WHERE prod_capacity <= 5");
        $low_stock_count = $stmt3->fetch(PDO::FETCH_ASSOC)['low_stock_count'];

        // 4. ธุรกรรมวันนี้
        $stmt4 = $this->db->prepare("SELECT 
            (SELECT COUNT(*) FROM stock_in WHERE date = :today) + 
            (SELECT COUNT(*) FROM stock_out WHERE date = :today) as daily_trans");
        $stmt4->execute([':today' => $today]);
        $daily_trans = $stmt4->fetch(PDO::FETCH_ASSOC)['daily_trans'];

        return [
            "total_items" => (int)$total_items,
            "total_value" => (float)$total_value,
            "low_stock_count" => (int)$low_stock_count,
            "daily_trans" => (int)$daily_trans
        ];
    }

    // ดึงรายการสินค้าใกล้หมด
    public function getLowStockList() {
        $stmt = $this->db->query("SELECT prod_name, prod_capacity FROM product WHERE prod_capacity <= 5 ORDER BY prod_capacity ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ดึงความเคลื่อนไหวล่าสุด (วันนี้)
    public function getRecentActivity() {
        $today = date('Y-m-d');
        $stmt = $this->db->prepare("
            (SELECT 'in' as type, p.prod_name, s.quantity, s.date FROM stock_in s JOIN product p ON s.prod_id = p.prod_id WHERE s.date = :today)
            UNION ALL
            (SELECT 'out' as type, p.prod_name, s.quantity, s.date FROM stock_out s JOIN product p ON s.prod_id = p.prod_id WHERE s.date = :today)
            ORDER BY date DESC
        ");
        $stmt->execute([':today' => $today]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}