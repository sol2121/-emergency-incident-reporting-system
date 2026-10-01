<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$incidentId = (int)($data["incident_id"] ?? 0);
$status = trim($data["status"] ?? "");

$allowedStatuses = [
    "new",
    "reviewed",
    "assigned",
    "in_progress",
    "resolved"
];

if ($incidentId <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Valid incident ID is required"
    ]);

    exit;
}

if (!in_array($status, $allowedStatuses)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid status"
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare(
        "UPDATE incidents
         SET status = ?
         WHERE id = ?"
    );

    $stmt->execute([
        $status,
        $incidentId
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Emergency status updated successfully"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update emergency status",
        "error" => $e->getMessage()
    ]);
}