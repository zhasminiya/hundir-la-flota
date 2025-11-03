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


// Generamos una partida nueva ---
try {
    $tablero = 10;

    // CAMBIADO
    $definicionFlota = [
        ["nombre" => "Portaviones", "tamano" => 5],
        ["nombre" => "Acorazado", "tamano" => 4],
        ["nombre" => "Destructor", "tamano" => 3],
        ["nombre" => "Submarino", "tamano" => 3],
        ["nombre" => "Patrullero", "tamano" => 2],
    ];

    $barcos = []; // CAMBIADO
    $ocupado = [];

    function orientacionAleatoria(){
        return (bool)random_int(0, 1);
    }

    foreach($definicionFlota as $defBarco) {
        $nombre = $defBarco['nombre'];
        $tamano = (int)$defBarco['tamano'];
        $estaColocado = false;

        while(!$estaColocado){
            $horizontal = orientacionAleatoria();
            if($horizontal) {
                $fila = random_int(0, $tablero - 1);
                $columna = random_int(0, $tablero - $tamano);
            }else{
                $fila = random_int(0, $tablero - $tamano);
                $columna = random_int(0, $tablero - 1);
            }

            $coordenadas = [];
            $valido = true;

            for($i = 0; $i < $tamano; $i++){
                $r = $fila + ($horizontal ? 0 : $i);
                $c = $columna + ($horizontal ? $i : 0);
                $key = $r . '-' . $c;

                if ($r < 0 || $r >= $tablero || $c < 0 || $c >= $tablero) {
                    $valido = false;
                    break;
                }

                if (isset($ocupado[$key])) {
                    $valido = false;
                    break;
                }
                $coordenadas[] = [$r, $c]; // CAMBIADO
            }

            if ($valido) {
                foreach ($coordenadas as $posicion) {
                    $ocupado[$posicion[0] . '-' . $posicion[1]] = true;
                }

                // CAMBIADO
                $barcos[] = [
                    "nombre" => $nombre,
                    "longitud" => $tamano, // CAMBIADO
                    "coordenadas" => $coordenadas,
                    "impactos" => 0 // CAMBIADO
                ];

                $estaColocado = true;
            }
        }    
    }

    // CAMBIADO
    $tableroVacio = [];
    for($i = 0; $i < 10; $i++) {
        $tableroVacio[$i] = array_fill(0, 10, 0);
    }

    // CAMBIADO
    echo json_encode([
        "tablero" => $tableroVacio,
        "barcos" => $barcos
    ]);

} catch (Exception $e) {
    // CAMBIADO
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al iniciar la partida: ' . $e->getMessage(),
        'tablero' => [],
        'barcos' => []
    ]);
}
?>