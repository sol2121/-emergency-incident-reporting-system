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

    $stmt = $pdo->query("
        SELECT
            COUNT(*) AS total,
            SUM(status = 'new') AS new_count,
            SUM(status = 'reviewed') AS reviewed_count,
            SUM(status = 'assigned') AS assigned_count,
            SUM(status = 'in_progress') AS in_progress_count,
            SUM(status = 'resolved') AS resolved_count
        FROM incidents
    ");

    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "stats" => $stats
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to load statistics",
        "error" => $e->getMessage()
    ]);
}