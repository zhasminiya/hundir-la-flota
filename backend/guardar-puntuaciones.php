<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // ojo, solo para pruebas
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$input = json_decode(file_get_contents('php://input'), true);

$nombre = isset($input['nombre']) ? trim($input['nombre']) : null;
$disparos = isset($input['disparos']) ? (int)$input['disparos'] : null;

if(!$nombre || !$disparos) {
    echo json_encode([
        "error" => true,
        "mensaje" => "Datos incompletos: se necesita 'nombre' y 'disparos'."
    ]);

    exit;
}

$archivo = __DIR__ . '/puntuaciones.json';

if(file_exists($archivo)) {
    $contenido = file_get_contents($archivo);
    $puntuaciones = json_decode($contenido, true);

    //si contenido no es válido lo reiniciamos
    if(!is_array($puntuaciones)) {
        $puntuaciones = [];
    }
}else {
    $puntuaciones = [];
}

//crear la nueva entrada

$nuevaPuntuacion = [
    "nombre" => $nombre,
    "disparos" => $disparos,
    "fecha" => date('Y-m-d H:i:s')
];

$puntuaciones[] = $nuevaPuntuacion; //añade la nueva puntuación al final del array sin eliminar existentes

usort($puntuaciones, function($a, $b) {
    return $a['disparos'] <=> $b['disparos']; // Orden ascendente (menos disparos = mejor)
});

//Limitar a las 10 mejores
$puntuaciones = array_slice($puntuaciones, 0, 10);

// Guardar en el archivo
file_put_contents(
    $archivo,
    json_encode($puntuaciones, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
);

echo json_encode([
    "mensaje" => "Puntuación guardada correctamente",
    "puntuaciones" => $puntuaciones  
], JSON_UNESCAPED_UNICODE); 


?>