<?php

include 'lib/Event.php';
if (!headers_sent()) {
  header('Content-Type: application/json');
}
echo (new Event)->load(
  isset($_GET['year']) ? $_GET['year'] : date('Y'),
  isset($_GET['month']) ? $_GET['month'] : date('m'),
);
