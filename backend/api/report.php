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

$type = trim($data["type"] ?? "");
$description = trim($data["description"] ?? "");
$location = trim($data["location"] ?? "");
$severity = trim($data["severity"] ?? "medium");

if ($type === "" || $description === "" || $location === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Type, description, and location are required"
    ]);

    exit;
}

$allowedSeverity = ["low", "medium", "high"];

if (!in_array($severity, $allowedSeverity)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid severity"
    ]);

    exit;
}

try {

    /*
     * For now we use user_id = 1.
     * Later we will get the actual logged-in user's ID
     * from the authentication system.
     */

 $userId = (int)($data["user_id"] ?? 0);

if ($userId <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Valid user ID is required"
    ]);

    exit;
}

    $stmt = $pdo->prepare(
        "INSERT INTO incidents
        (user_id, type, description, location, severity, status)
        VALUES (?, ?, ?, ?, ?, 'new')"
    );

    $stmt->execute([
        $userId,
        $type,
        $description,
        $location,
        $severity
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Emergency report submitted successfully",
        "incident_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}