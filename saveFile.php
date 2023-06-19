<?php

include 'functions.php';

// Répertoire de destination pour sauvegarder les fichiers
$uploadDir = 'uploads/image/';
$thumbnailDir = 'uploads/thumb/';

// Vérifier si le répertoire de destination existe, sinon le créer
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0775, true);
}

// Vérifier si le répertoire des miniatures existe, sinon le créer
if (!is_dir($thumbnailDir)) {
  mkdir($thumbnailDir, 0775, true);
}

// Vérifier si un fichier a été envoyé
if (isset($_FILES['file'])) {
  $file = $_FILES['file'];

  // Générer un nom de fichier unique
  $fileName = uniqid() . '_' . $file['name'];

  // Chemin complet du fichier de destination
  $filePath = $uploadDir . $fileName;

  // Déplacer le fichier vers le répertoire de destination
  if (move_uploaded_file($file['tmp_name'], $filePath)) {
    // Générer une miniature
    $thumbnailPath = $thumbnailDir . $fileName;
    generateThumbnail($filePath, $thumbnailPath, 64, 64);


    // Fichier et miniature enregistrés avec succès, renvoyer les URLs
    $response = [
      'url' => $filePath,
      'thumbnailUrl' => $thumbnailPath
    ];
    echo json_encode($response);
  } else {
    // Erreur lors de l'enregistrement du fichier
    http_response_code(500);
    echo "Une erreur s'est produite lors de l'enregistrement du fichier.";
  }
} else {
  // Aucun fichier n'a été envoyé
  http_response_code(400);
  echo "Aucun fichier n'a été envoyé.";
}
