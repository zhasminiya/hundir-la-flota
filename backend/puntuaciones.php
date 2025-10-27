<?php
//puntuaciones.php
//Devuelve el listado  de puntuaciones guardadas en formato JSON

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$archivo = __DIR__ . '/puntuaciones.json'; //ruta completa del archivo

if(file_exists($archivo)) {
    //Leer el contenido de archivo
    $contenido = file_get_contents($archivo);

    //Decodificar JSON a array PHP
    $puntuaciones = json_decode($contenido, true);

    //Comprobar si esta vacio o mal formateado
    if(!is_array($puntuaciones)) {
        $puntuaciones = [];
    }
}else{
    //si el archivo no existe, crear uno vacío
    $puntuaciones = [];
    file_put_contents($archivo, json_encode($puntuaciones, JSON_PRETTY_PRINT));
}

//devorver contenido en JSON
echo json_encode([
    "mensaje" => "Puntuaciones cargadas correctamente",
    "puntuaciones" => $puntuaciones
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

?>