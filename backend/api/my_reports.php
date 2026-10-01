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

    $userId = (int)($_GET["user_id"] ?? 0);

    if ($userId <= 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Valid user ID is required"
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT
            id,
            type,
            description,
            location,
            severity,
            status,
            created_at
         FROM incidents
         WHERE user_id = ?
         ORDER BY created_at DESC"
    );

    $stmt->execute([$userId]);

    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "reports" => $reports
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to retrieve reports",
        "error" => $e->getMessage()
    ]);
}