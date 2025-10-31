<?php
// Activamos la visualización de errores en la consola
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Le decimos que el contenido devuelto será de tipo JSON
header('Content-Type: application/json');

// Permitimos peticiones desde cualquier sitio
header('Access-Control-Allow-Origin: *');

// Definimos los métodos HTTP que permitimos
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Permitimos el encabezado "Content-Type" en las peticiones
header('Access-Control-Allow-Headers: Content-Type');


// Leemos el archivo de puntuaciones ---
try {
    $file = 'puntuaciones.json'; // CAMBIADO
    $puntuaciones = [];

    // Comprobamos si el archivo existe y si existe lo leemos
    if (file_exists($file)) {
        $content = file_get_contents($file); // Leemos el contenido del archivo
        if ($content !== false && !empty($content)) {
            $decoded = json_decode($content, true); // Lo convertimos en un array
            if ($decoded !== null && is_array($decoded)) {
                $puntuaciones = $decoded; // Si todo está bien lo guardamos
            }
        }
    }

    // Si no había puntuaciones o el archivo no existe creamos un archivo vacío
    if (empty($puntuaciones) && !file_exists($file)) {
        file_put_contents($file, json_encode([], JSON_PRETTY_PRINT)); // Guardamos en el archivo un array vacío
        chmod($file, 0666); //  Damos permisos de lectura y escritura al archivo por si acaso.
    }

    // Devolvemos las puntuaciones
    echo json_encode($puntuaciones); // CAMBIADO

} catch (Exception $e) {
    //error
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al cargar las puntuaciones: ' . $e->getMessage(),
        'scores' => []
    ]);
}
?>