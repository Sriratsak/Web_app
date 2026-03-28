<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
require_once "../Database.php";
require_once "../model/Category.php";

/* DATABASE CONNECTION */
$db = (new Database())->getConnection();
$category = new Category($db);

/* REQUEST METHOD */
$method = $_SERVER['REQUEST_METHOD'];

/* GET ID FROM URL  /api/category.php/1 */
$uri = $_SERVER['REQUEST_URI'];
$id = null;

if (preg_match('#/api/category.php/([0-9]+)$#', $uri, $matches)) {
    $id = $matches[1];
}

/* GET JSON BODY */
$data = json_decode(file_get_contents("php://input"), true);

if(!$data){
    $data = [];
}

switch($method){

    /* ======================
       GET : READ ALL
    ====================== */
    case "GET":

        $result = $category->getAll();
        echo json_encode($result);

    break;


    /* ======================
       POST : CREATE
    ====================== */
    case "POST":

        if(empty($data['category_name'])){
            echo json_encode([
                "error" => "category_name required"
            ]);
            exit;
        }

        $result = $category->create(
            $data['category_name']
        );

        echo json_encode([
            "success" => $result
        ]);

    break;


    /* ======================
       PUT : UPDATE
    ====================== */
    case "PUT":

        if(!$id){
            echo json_encode([
                "error" => "ID required"
            ]);
            exit;
        }

        if(empty($data['category_name'])){
            echo json_encode([
                "error" => "category_name required"
            ]);
            exit;
        }

        $result = $category->update(
            $id,
            $data['category_name']
        );

        echo json_encode([
            "success" => $result
        ]);

    break;


    /* ======================
       DELETE
    ====================== */
    case "DELETE":

        if(!$id){
            echo json_encode([
                "error" => "ID required"
            ]);
            exit;
        }

        $result = $category->delete($id);

        echo json_encode([
            "success" => $result
        ]);

    break;


    /* ======================
       METHOD NOT ALLOWED
    ====================== */
    default:

        echo json_encode([
            "error" => "Method not allowed"
        ]);

}
?>