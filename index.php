<?php
session_start();


header('Content-Type: text/html');
flush();

/**
 * Retrieve a random file from a folder.
 *
 * @param string $folderPath The path to the folder.
 * @return string|null The path of the random file, or null if no files are found.
 */
function getRandomFileFromFolder($folderPath)
{
    // Get all files from the folder
    $files = glob($folderPath . '*');

    // Check if there are any files in the folder
    if (count($files) > 0) {
        // Get a random file from the array
        $randomFile = $files[array_rand($files)];
        return basename($randomFile);
    } else {
        return null; // No files found in the folder
    }
}

?>
<!DOCTYPE HTML>
<html>

<head>
    <title>Calendrier du Jardin</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Calendrier du Jardin" />
    <meta name="keywords" content="Jardin, calendrier, calendrier du jardin" />
    <meta name="author" content="admin@jardindespetits.fr" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" type="text/css" href="style.css?v20">
</head>

<body style="/*background-image:url('/img/bg/<?php echo getRandomFileFromFolder(__DIR__ . '/img/bg/') ?>');*/">
    <h1>Planning du jardin</h1>
    <?php

    if (isset($_GET['password']) && sha1($_GET['password']) == '7ec37b154f11849256633827e3670108103a79c3') {
        $_SESSION['user'] = $_GET['user'];
    }
    if (!isset($_SESSION['user'])) {

        echo 'Veuillez vous connecter:';
        echo '<form method><input type="text" name="user" value="' . ($_GET['user'] ?? '') . '" placeholder="Nom d\'utilisateur"/>
        <input type="password" name="password" value="' . ($_GET['password'] ?? '') . '" placeholder="Mot de passe"/>
        <input type="submit" name="submit" value="Se connecter" class="btn"/>
        </form>';
    } else {


    ?>
        <div class="container">

            <p>Chers parents, <br />Ce site nous permet, enseignants et parents, de nous coordonner pour gérer le jardin des petits de façon collective.</p>
            <p>Le principe est de nous aider à entretenir ce jardin, en échange de bons moments avec vos enfants et de quelques légumes à ramasser pendant l'été lorsqu'ils sont prêts! Vous pouvez ramasser tomates et courgettes durant l'été, lorsque nous n'avons pas école. Laissez aux élèves le plaisir de sortir les pommes de terre, de ramasser courges, tomates et courgettes à la rentrée des classes. Nous les utiliserons pour la soupe d'automne.</p>

            <p>Nous vous remercions de noter sur le calendrier quand vous êtes allés au jardin et ce que vous y avez fait (arrosage, désherbage, cueillette) ainsi que les jours où vous compter y aller. Vous pouvez ajouter des photos du jardin, de votre récolte. </p>
            <p style="font-weight:bold;">Bon jardinage</p>
            <button id="calendarToogle" class="selected"><i class="fa-solid fa-calendar"></i> Voir le calendrier</button>
            <button id="eventListButton" style="display:none"><i class="fa-solid fa-list"></i> Voir la liste des événements</button>
            <button id="addEvent"><i class="fa-solid fa-calendar-plus"></i> Ajouter un événement</button>
        </div>
        </div>
        <div id="events-list" class="block"></div>
        <div id="calendar" class="block"></div>
        <div id="form" class="block container"><?php include 'form.php'; ?></div>

        <br /><br />
        <script>
            last3MonthsEvents = <?php include 'load.php'; ?>
        </script>

        <footer>
            <div class="container">


                <!-- p>Pour recevoir des notifications sur votre téléphone,
                    installez l'application <em>ntfy</em> via Google Play,
                    F-Droid ou l'Apple store. <br />
                    Cliquer sur une des images pour télécharger l'appli
                <div class="applink">
                    <a target="_blank" href="https://play.google.com/store/apps/details?id=io.heckel.ntfy">
                        <img alt="Get it on Google Play" data-src="/img/badge-google.19268080.png" width="96" height="auto">
                    </a>
                    <a target="_blank" href="https://f-droid.org/en/packages/io.heckel.ntfy/">
                        <img alt="Get it on F-Droid" data-src="/img/badge-fdroid.f6ae6646.png" width="96" height="auto">
                    </a>
                    <a target="_blank" href="https://apps.apple.com/us/app/ntfy/id1625396347">
                        <img alt="Download on the App Store" data-src="/img/badge-apple.4bec723d.png" width="96" height="auto">
                    </a>
                </div>
                <br />Une fois installé, ouvrez-le et abonnez-vous à <strong>ecoletallende</strong>,
                en appuyant sur le + en bas à droite.<br />
                Cochez la case "Utiliser un serveur différent" et entrer
                <strong>http://ntfy.nethttp.net:4380</strong></p>

                <img data-src="/img/screenshot.jpg" style="width: 200px; height: auto;" alt="" />
                <div>

                    <p>
                        <strong>ntfy</strong> (pronounced <em>notify</em>) is a simple HTTP-based
                        <a href="https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern">
                            pub-sub
                        </a>
                        notification service.
                        It allows you to send notifications to your phone or desktop via scripts from any computer,
                        and/or using a REST API. It's infinitely flexible, and
                        <a class="underline hover:no-underline" href="/#free-software">100% free software</a>.
                    </p>
                </div -->

                <div class="row">
                    <div class="col-md-12">
                        <p class="copyright">
                            &copy; <?php echo date('Y') . '' . $_SERVER['HTTP_HOST'] . PHP_EOL; ?>
                        </p>
                    </div>
                </div>
            </div>

        </footer>


        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
        <script src="js/FormImagePreview.js"></script>
        <script src="js/ProgressBarManager.js"></script>
        <script src="js/FormUploader.js"></script>
        <script src="js/Gallery.js"></script>

        <script src="js/Calendar.js?v3"></script>
        <script src="js/script.js"></script>
    <?php
    }
    ?>

</body>

</html>