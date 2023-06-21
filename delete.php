<?php

include_once 'lib/Event.php';

$EventLib = new Event();
$EventLib->delete($_POST);

if (!headers_sent()) {
    header('Content-Type: application/json');
}
echo $EventLib->load(
    isset($_GET['year']) ? $_GET['year'] : date('Y'),
    isset($_GET['month']) ? $_GET['month'] : date('m'),
);