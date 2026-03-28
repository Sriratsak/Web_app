<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../Database.php";
require_once "../Model/Product.php";

$db = (new Database())->getConnection();
$product = new Book($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

/* ---------------------------
   match id จาก path
--------------------------- */
$id = null;
if(preg_match('#/api/product.php/([0-9]+)$#', $uri, $m)){
    $id = $m[1];
}

$data = json_decode(file_get_contents("php://input"), true);


/* ---------------------------
   GET
--------------------------- */
if($method == "GET"){

    if($id){
        echo json_encode($product->getById($id));
    }else{
        echo json_encode($product->getAll());
    }

}


/* ---------------------------
   CREATE
--------------------------- */
if($method == "POST"){

    $result = $book->create(
        $data['prod_id'] ?? '',
        $data['prod_name'] ?? '',
        $data['prod_price'] ?? '',
        $data['prod_capacity'] ?? '',
        $data['category_id'] ?? null,
      
    );

    echo json_encode(["success"=>$result]);

}


/* ---------------------------
   UPDATE
--------------------------- */
if($method == "PUT" && $id){

    $result = $book->update(
        $id,
       $data['prod_id'] ?? '',
        $data['prod_name'] ?? '',
        $data['prod_price'] ?? '',
        $data['prod_capacity'] ?? '',
        $data['category_id'] ?? null,
    );

    echo json_encode(["success"=>$result]);

}


/* ---------------------------
   DELETE
--------------------------- */
if($method == "DELETE" && $id){

    $result = $book->delete($id);
    echo json_encode(["success"=>$result]);

}

?>