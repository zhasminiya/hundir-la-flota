// Ruta de los archivos PHP
const API = '/hundir-la-flota/backend/';

// Variables para el tablero, barcos y estado del juego
let tablero = [], barcos = [], numDisparos = 0;

// Tamaños de los barcos (en número de casillas)
const longitudBarcos = [5, 4, 3, 3, 2];

// Nombres de los barcos (en el mismo orden que los tamaños)
const nombreBarcos = ['Portaviones', 'Acorazado', 'Destructor', 'Submarino', 'Patrullero'];

// Indica si el juego ha terminado
let juegoTerminado = false;
// Función auxiliar para obtener elementos del DOM fácilmente
const $ = id => document.getElementById(id);

async function iniciarJuego() {
    // Dibujamos el tablero
    PintarTablero();
    // cargamos la lista de ganadores
    cargarListadoGanadores()
}


// Función para pintar el tablero de 10x10
function PintarTablero() {
    const container = $('tablero'); // Contenedor del tablero
    container.innerHTML = ''; // Borra el tablero anterior

    // Crear 100 celdas (10x10)
    for (let y = 0; y < 10; y++) { // primer bucle de 10 lineas
        for (let x = 0; x < 10; x++) { //segundo bucle pinta 10 celdas en cada linea
            const celda = document.createElement('div');
            celda.className = 'celda';     // Clase CSS para la celda
            celda.dataset.x = x;           // Para guardar las coordenadas X
            celda.dataset.y = y;           // Para guardar las coordenadas
            container.appendChild(celda);  // Ponemos la celda en el tablero
        }
    }
}

// Función para mostrar los mensajes del estado del juego
function pasos(mensaje) {
    const estadoDelJuego = $('estado-del-juego');
    estadoDelJuego.textContent = mensaje;
}

//Funcion para cargar la lista de los ganadores
async function cargarListadoGanadores() {
    try {
        const res = await fetch(API + 'puntuaciones.php');
        const list = await res.json();
        const ol = $('lista-ganadores');
        ol.innerHTML = '';
        if (list.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Sin puntuaciones';
            li.style.fontStyle = 'italic';
            ol.appendChild(li);
        } else {
            list.forEach((item, i) => {
                const li = document.createElement('li');
                li.textContent = `${i + 1}. ${item.nombre} - ${item.disparos} disparos`;
                ol.appendChild(li);
            });
        }
    } catch (e) {
        console.error('Error cargando puntuaciones:', e);
    }
}

// Al cargar la página iniciamos automáticamente el juego
window.onload = iniciarJuego;