<?php
//puntuaciones.php
//Devuelve el listado  de puntuaciones guardadas en formato JSON

error_reporting(E_ALL);
ini_set('display_errors', 1);


header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

//para permitir peticiones desde el frontend
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


// try-catch para manejo de errores
try {
    //$archivo = __DIR__ . '/puntuaciones.json'; //ruta completa del archivo
    //Ponemos la ruta relativa por si se cambia de nombre la carpeta que no de error
    $archivo = 'puntuaciones.json';

    if (file_exists($archivo)) {
        //Leer el contenido de archivo
        $contenido = file_get_contents($archivo);

        //Decodificar JSON a array PHP
        $puntuaciones = json_decode($contenido, true);

        //Comprobar si esta vacio o mal formateado
        if (!is_array($puntuaciones)) {
            $puntuaciones = [];
        }
    } else {
        //si el archivo no existe, crear uno vacío
        $puntuaciones = [];
        file_put_contents($archivo, json_encode($puntuaciones, JSON_PRETTY_PRINT));
    }

    //devorver contenido en JSON
    /*echo json_encode([
    "mensaje" => "Puntuaciones cargadas correctamente",
    "puntuaciones" => $puntuaciones
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);*/
    // cambio la respuesta exito y booleano
    echo json_encode([
        'exito' => true,
        'puntuaciones' => $puntuaciones
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    // errores
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'error' => 'Error al cargar las puntuaciones: ' . $e->getMessage()
    ]);
}
?>
