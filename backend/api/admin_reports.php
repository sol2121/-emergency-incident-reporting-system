<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed"
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare(
        "SELECT
            incidents.id,
            incidents.user_id,
            users.name,
            users.email,
            incidents.type,
            incidents.description,
            incidents.location,
            incidents.severity,
            incidents.status,
            incidents.created_at
         FROM incidents
         INNER JOIN users
         ON incidents.user_id = users.id
         ORDER BY incidents.created_at DESC"
    );

    $stmt->execute();

    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "reports" => $reports
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to retrieve emergency reports",
        "error" => $e->getMessage()
    ]);
}