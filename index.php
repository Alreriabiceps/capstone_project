<?php
session_start();
$mysqli = new mysqli('localhost', 'root', '', 'billing_system');

if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    loginUser($username, $password);
}

function loginUser($username, $password) {
    global $mysqli;
    $stmt = $mysqli->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['role'] = $user['role'];
            header('Location: home.html');
            exit;
        } else {
            echo 'Invalid credentials!';
        }
    } else {
        echo 'Invalid credentials!';
    }
}
?>
