<?php
session_start();

include_once 'functions.php';
include_once 'lib/Event.php';

$EventLib = new Event();
$event = $_POST['id'] == 0 ? $EventLib->create($_POST) : $EventLib->update($_POST);

/**
 * ntfy
 */
$params = [
    "topic"=> "ecoletallende",
    "title"=> $_SESSION['user'].': '.($_POST['name']??''),
    "message"=> 'Le '.date('d/m/y',strtotime($_POST['date']))."\n".($_POST['description']??'')
];

if(isset($_POST['fileUrl'])){
    $img = str_replace('image/','thumb/1024_',$_POST['fileUrl'][0]);
    generateThumbnail($_POST['fileUrl'][0],$img,1024,1024);
    $params['attach'] = 'https://'.$_SERVER['HTTP_HOST'].'/'.$img;
}

file_get_contents('http://ntfy.nethttp.net:4380/', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json",
        'content' => json_encode($params)
    ]
]));

if (!headers_sent()) {
    header('Content-Type: application/json');
}
echo $EventLib->load(
    isset($_GET['year']) ? $_GET['year'] : date('Y'),
    isset($_GET['month']) ? $_GET['month'] : date('m'),
);
