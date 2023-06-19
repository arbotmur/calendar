<?php

/*
// Define the directory where event files are stored
$directory = __DIR__.'/uploads/data/';

// Calculate the date 3 months ago
$threeMonthsAgo = strtotime('-3 months');

// Array to store the loaded events
$events = array();

// Get all JSON files in the directory
$files = glob($directory . '*.json');
$n=0;
foreach ($files as $file) {
  // Get the file's last modification date
  $date = str_replace('.json','',basename($file));
  // Check if the file's modified date is within the last 3 months
  if (strtotime($date) >= $threeMonthsAgo) {
    // Read the JSON file and add its contents to the events array
    $jsonData = file_get_contents($file);
    $eventData = json_decode($jsonData, true);
    
    foreach($eventData as $event){
      if(!isset($event['id'])){
        $event['id']=$n;
      }
      $events[$event['id']] = $event;
      $n++;
    }
  }
}

ksort($events);

// Encode the events array as JSON and send the response
if (!headers_sent()) {
    header('Content-Type: application/json');
}
echo json_encode($events);
*/

include 'lib/Event.php';
if (!headers_sent()) {
  header('Content-Type: application/json');
}
echo (new Event)->load(
  isset($_GET['year']) ? $_GET['year'] : date('Y'),
  isset($_GET['month']) ? $_GET['month'] : date('m'),
);
