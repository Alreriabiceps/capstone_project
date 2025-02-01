<?php
$hashedPassword = password_hash('admin', PASSWORD_BCRYPT);
echo $hashedPassword;
?>
