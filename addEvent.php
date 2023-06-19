<?php

/*
// Chemin du fichier de données
$dataPath = __DIR__ . '/uploads/data/';

// Vérifier si le répertoire de destination existe, sinon le créer
if (!is_dir($dataPath)) {
    mkdir($dataPath, 0775, true);
}

$dateFragments = explode('-', $_POST['date']);

$fileName = $dateFragments[0] . '-' . $dateFragments[1] . '.json';
$filePath = $dataPath . $fileName;

// Vérifier si le fichier existe
if (file_exists($filePath)) {
    // Charger les données existantes
    $existingData = json_decode(file_get_contents($filePath), true);
} else {
    // Créer un tableau vide si le fichier n'existe pas
    $existingData = [];
}

$data = $_POST;
$data['HTTP_USER_AGENT'] = $_SERVER['HTTP_USER_AGENT'];
$data['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'];
$data['id'] = $data['id'] == 0 ? time() : $data['id'];
$existingData[$data['id']] = $data;

// Enregistrer les données dans le fichier JSON
$result = file_put_contents($filePath, json_encode($existingData, JSON_PRETTY_PRINT));

if ($result === false) {
    // Gérer les erreurs en cas d'échec de l'enregistrement
    http_response_code(500);
    echo "Une erreur s'est produite lors de l'enregistrement des données.";
} else {
    // Répondre avec un code de succès
    http_response_code(200);
    echo "L'événement a été ajouté avec succès.";
}
*/

include_once 'lib/Event.php';

$EventLib = new Event();
$event = $_POST['id'] == 0 ? $EventLib->create($_POST) : $EventLib->update($_POST);

if (!headers_sent()) {
    header('Content-Type: application/json');
}
echo $EventLib->load(
    isset($_GET['year']) ? $_GET['year'] : date('Y'),
    isset($_GET['month']) ? $_GET['month'] : date('m'),
);
