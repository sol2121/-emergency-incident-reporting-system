<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle browser CORS preflight request
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

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($name === "" || $email === "" || $password === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);

    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid email address"
    ]);

    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 6 characters"
    ]);

    exit;
}

try {

    // Check whether email already exists
    $check = $pdo->prepare(
        "SELECT id FROM users WHERE email = ?"
    );

    $check->execute([$email]);

    if ($check->fetch()) {
        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "Email already exists"
        ]);

        exit;
    }

    // Securely hash the password
    $hashedPassword = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    // Insert user
    $stmt = $pdo->prepare(
        "INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, 'citizen')"
    );

    $stmt->execute([
        $name,
        $email,
        $hashedPassword
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Registration failed"
    ]);
}