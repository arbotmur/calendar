<?php

/*
include 'functions.php';
header('Content-Type: application/json');

// Get the POST data
$date = isset($_POST['date']) ? $_POST['date'] : null;
$id = isset($_POST['id']) ? $_POST['id'] : null;

$response = ['error' => false, 'message' => 'Event removed'];

if ($date && $id) {
    // Prepare the file paths
    $filePath1 = 'uploads/data/' . date('Y-m', strtotime($date)) . '.json';
    $filePath2 = 'uploads/data/' . $date . '.json';

    // Remove the event from the file if it exists
    $response['error'] = false;
    if (!removeEventFromFile($filePath1, $id)) {
        if (!removeEventFromFile($filePath2, $id)) {
            
            $jsonFiles = glob('uploads/data/*.json');
            $eventFound = false;

            foreach ($jsonFiles as $jsonFile) {
                if (removeEventFromFile($jsonFile, $id)) {
                    $eventFound = true;
                    break;
                }
            }

            if (!$eventFound) {
                http_response_code(400);
                $response = ['error' => true, 'message' => 'Event not found!'];
                echo json_encode($response);
                exit();
            }
        }
    }

    if (isset($_POST['fileUrl'])) {
        foreach ($_POST['fileUrl'] as $fileUrl) {
            if (is_file($fileUrl)) {
                unlink($fileUrl);
            }
            $thumbFile = str_replace('uploads/image/', 'uploads/thumb/', $fileUrl);
            if (is_file($thumbFile)) {
                unlink($thumbFile);
            }
        }
    }
} else {
    http_response_code(400);
    $response = ['error' => true, 'message' => 'Date and ID are required'];
}

include_once 'load.php';
*/

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