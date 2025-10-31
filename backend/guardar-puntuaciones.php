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

// manejo de OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Leemos los datos enviados por POST
    $input = file_get_contents('php://input');
    $data = json_decode($input, true); // Convertimos el texto JSON a un array

    echo $data;

    // Comprobamos que los datos existen y tienen los campos esperados.
    if (!$data || !isset($data['nombre']) || !isset($data['disparos'])) {
        throw new Exception('Datos incompletos'); // Si falta algo damos error
    }

    // validación y limpieza
    $nombre = htmlspecialchars(trim($data['nombre']));
    $disparos = (int)$data['disparos']; // Aseguramos que los disparos sean un número entero

    // Validamos que los datos no estén vacíos y que el número de disparos sea mayor que cero
    if (empty($nombre) || $disparos <= 0) {
        throw new Exception('Nombre o puntuación inválidos'); // Si no cumple damos error
    }

    // Si el nombre es mas largo de 20 caracteres lo recortamos
    if (strlen($nombre) > 20) {
        $nombre = substr($nombre, 0, 20);
    }

    // nombre del archivo
    $file = 'puntuaciones.json';

    // lectura fichero
    $puntuaciones = [];
    if (file_exists($file)) {
        // Si el archivo existe  lo leemos
        $content = file_get_contents($file);
        if ($content !== false && !empty($content)) {
            $decoded = json_decode($content, true);
            if ($decoded !== null) {
                $puntuaciones = $decoded; // Guardamos las puntuaciones
            }
        }
    }

    // formato de fecha
    $puntuaciones[] = [
        'nombre' => $nombre,
        'disparos' => $disparos,
        'fecha' => date('d-m-Y H:i:s')
    ];

    // ordenamos
    usort($puntuaciones, function($a, $b) {
        return $a['disparos'] <=> $b['disparos'];
    });

    // Dejamos solo el top 10
    $puntuaciones = array_slice($puntuaciones, 0, 10);

    // guardamos y obtenemos respuesta
    $jsonData = json_encode($puntuaciones, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents($file, $jsonData) === false) {
        throw new Exception('Error al guardar las puntuaciones');
    }

    // Damos permisos de lectura y escritura al archivo por si acaso
    chmod($file, 0666);

    // respuesta en JSON
    echo json_encode([
        'exito' => true,
        'mensaje' => 'Puntuación guardada correctamente',
        'puntuaciones' => $puntuaciones
    ]);

} catch (Exception $e) {
    // error
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'error' => $e->getMessage()
    ]);
}
?>