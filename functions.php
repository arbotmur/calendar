<?php

/**
 * Génère une miniature d'une image en utilisant Imagick.
 *
 * @param string $sourcePath Chemin d'accès à l'image source.
 * @param string $destinationPath Chemin d'accès de la miniature de destination.
 * @param int $width Largeur de la miniature.
 * @param int $height Hauteur de la miniature.
 */
function generateThumbnail($sourcePath, $destinationPath, $width, $height)
{
    $imagick = new Imagick($sourcePath);
    $imagick->cropThumbnailImage($width, $height);
    $imagick->writeImage($destinationPath);
    $imagick->destroy();
}





