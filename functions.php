<?php
use \Imagick as Imagick; 
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
    $orientation = $imagick->getImageOrientation();
    switch ($orientation) {
        case Imagick::ORIENTATION_BOTTOMRIGHT:
            $imagick->rotateimage("#000", 180); // rotate 180 degrees
            break;
        case Imagick::ORIENTATION_RIGHTTOP:
            $imagick->rotateimage("#000", 90); // rotate 90 degrees CW
            break;
        case Imagick::ORIENTATION_LEFTBOTTOM:
            $imagick->rotateimage("#000", -90); // rotate 90 degrees CCW
            break;
    }

    // Now that it's auto-rotated, make sure the EXIF data is correct in case the EXIF gets saved with the image!
    $imagick->setImageOrientation(Imagick::ORIENTATION_TOPLEFT);

    $imagick->cropThumbnailImage($width, $height);

    $imagick->writeImage($destinationPath);
    $imagick->destroy();
}
