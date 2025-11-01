<?php
// iniciar-juego.php
// Genera una partida nueva: coloca aleatoriamente la flota en un tablero 10x10
// Devuelve JSON con la flota y sus coordenadas.

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cabeceras: JSON y permitir acceso desde el front (útil en dev local).
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

//falta
header('Access-Control-Allow-Headers: Content-Type');

//Configuracion

// Ponemos try-catch por si hay algún error
try {
    $tablero = 10;

    //Definicion de la flota: nombre y tamaño
    $definicionFlota = [
        ["nombre" => "Portaviones", "tamano" => 5],
        ["nombre" => "Acorazado", "tamano" => 4],
        ["nombre" => "Destructor", "tamano" => 3],
        ["nombre" => "Submarino", "tamano" => 3],
        ["nombre" => "Patrullero", "tamano" => 2],

    ];

    //resultado final
    $barcos = []; // cambiado colocadoBarcos x barcos

    //mapa con casillas ocupadas para chequear solapamientos. Usaremos "r-c" como clave

    $ocupado = [];

    //Funcion auxiliar para generar un booleano aleatorio true = horizontal, false = vertical
    function orientacionAleatoria()
    {
        return (bool)random_int(0, 1);
    }

    //para cada barco en la definicion de la flota  intentamos colocarlo hasta que encaje
    foreach ($definicionFlota as $defBarco) {
        $nombre = $defBarco['nombre'];
        $tamano = (int)$defBarco['tamano'];
        $estaColocado = false;

        //Intentar colocar correctamente

        while (!$estaColocado) {
            $horizontal = orientacionAleatoria();
            if ($horizontal) {
                $fila = random_int(0, $tablero - 1);
                $columna = random_int(0, $tablero - $tamano);
            } else {
                $fila = random_int(0, $tablero - $tamano);
                $columna = random_int(0, $tablero - 1);
            }

            //preparar  las coordenadas del barco y validar
            $coordenadas = [];
            $valido = true;

            for ($i = 0; $i < $tamano; $i++) {
                $r = $fila + ($horizontal ? 0 : $i);
                $c = $columna + ($horizontal ? $i : 0);
                $key = $r . '-' . $c;

                if ($r < 0 || $r >= $tablero || $c < 0 || $c >= $tablero) {
                    $valido = false;
                    break;
                }

                // Comprobación: solapamiento
                if (isset($ocupado[$key])) {
                    $valido = false;
                    break;
                }
                //cambiado para recibir coordenadas solamente
                //yo espero [5, 3] y estaba recibiendo ["fila" => 5, "columna" => 3]
                //$coordenadas[] = ["fila" => $r, "columna" => $c];
                $coordenadas[] = [$r, $c];
            }

            // Si válida, marcamos ocupadas y añadimos el barco al resultado
            if ($valido) {
                foreach ($coordenadas as $posicion) {
                    //cambiado para recibir coordenadas solamente
                    //$ocupado[$posicion['fila'] . '-' . $posicion['columna']] = true;
                    $ocupado[$posicion[0] . '-' . $posicion[1]] = true;

                }

                //cambio extructura para coincidir con lo que espero
                /*$colocadoBarcos[] = [
                "nombre" => $nombre,
                "tamano" => $tamano,
                "posiciones" => $coordenadas,
                // Campos útiles para el front al inicializar el estado del juego
                "hitos" => 0,
                "hundido" => false
            ];*/
                $barcos[] = [
                    "nombre" => $nombre,
                    "longitud" => $tamano, // cabio tamano x longitud
                    "coordenadas" => $coordenadas,
                    "impactos" => 0 // cambio hitos x impactos
                ];

                $estaColocado = true;
            }
            // Si no es válida, el while repite y se generan nuevas coordenadas/orientación
        }
    }

    $tableroVacio = [];
    for ($i = 0; $i < 10; $i++) {
        $tableroVacio[$i] = array_fill(0, 10, 0);
    }

    //Enviar JSON
    echo json_encode([
        "tablero" => $tableroVacio,
        "barcos" => $barcos //cambiado flota x barcos
    ]);

   
} catch (Exception $e) {
    // si da error
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al iniciar la partida: ' . $e->getMessage(),
        'tablero' => [],
        'barcos' => []
    ]);
}
