// Ruta de los archivos PHP
const API = './backend/';

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

// CAMBIADO: función completa de iniciarJuego como en A.js
async function iniciarJuego() {
    try {
        // Reinicio de variables y estado del juego
        numDisparos = 0;
        juegoTerminado = false;
        $('recuento').textContent = numDisparos;
        $('estado-del-juego').innerHTML = '';

        // CAMBIADO: petición al backend para iniciar juego
        const response = await fetch(API + 'iniciar-juego.php');

        if (!response.ok) throw new Error('HTTP ' + response.status);

        const data = await response.json();
        tablero = data.tablero;
        barcos = data.barcos;

        // Dibujamos el tablero
        PintarTablero();

        // CAMBIADO: agregadas funciones que faltaban
        pintarEstadoFlota();
        hideModal();
        cargarListadoGanadores();

        pasos('Juego iniciado');
    } catch (error) {
        pasos('Error al iniciar el Juego');
        console.error('Error iniciando juego:', error);
        alert('Error al iniciar el juego. Verifica que el servidor PHP esté funcionando.');
    }
}

// Función para pintar el tablero de 10x10
function PintarTablero() {
    const container = $('tablero');
    container.innerHTML = '';

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const celda = document.createElement('div');
            celda.className = 'celda';
            celda.dataset.x = x;
            celda.dataset.y = y;
            celda.addEventListener('click', onCellClick);
            container.appendChild(celda);
        }
    }
}


function pintarEstadoFlota() {
    const status = $('estado-flota');
    status.innerHTML = '';

    barcos.forEach((ship, i) => {
        const li = document.createElement('li');
        const name = nombreBarcos[i] || `Barco ${i + 1}`;

        const spanNombre = document.createElement('span');
        spanNombre.textContent = name;

        const spanCasillas = document.createElement('span');
        spanCasillas.textContent = `(${ship.longitud} casillas)`;

        li.appendChild(spanNombre);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(spanCasillas);

        li.className = ship.impactos === ship.longitud
            ? 'hundido'
            : ship.impactos > 0
                ? 'tocado'
                : 'normal';

        status.appendChild(li);
    });
}

function pasos(mensaje) {
    const estadoDelJuego = $('estado-del-juego');
    estadoDelJuego.textContent = mensaje;
}


function onCellClick(e) {
    if (juegoTerminado) return;

    numDisparos++;
    $('recuento').textContent = 50;
    comprobarGanador();

}


function comprobarGanador() {  
        showModal();
        cargarListadoGanadoresModal();

}

const showModal = () => $('ventana-ganador').classList.remove('hidden');
const hideModal = () => $('ventana-ganador').classList.add('hidden');

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
            // CAMBIADO: corregido para usar .nombre y .disparos como en B original
            list.forEach((item, i) => {
                const li = document.createElement('li');
                li.className = 'ganador-item';

                const container = document.createElement('div');
                container.className = 'ganador-contenedor';

                const izquierda = document.createElement('span');
                izquierda.className = 'ganador-izquierda';
                izquierda.textContent = `${i + 1}. ${item.nombre}`;

                const derecha = document.createElement('span');
                derecha.className = 'ganador-derecha';
                derecha.textContent = `${item.disparos} disparos`;

                container.appendChild(izquierda);
                container.appendChild(derecha);
                li.appendChild(container);
                ol.appendChild(li);
            });
        }
    } catch (e) {
        console.error('Error cargando puntuaciones:', e);
    }
}


async function cargarListadoGanadoresModal() {
    try {
        const res = await fetch(API + 'puntuaciones.php');
        const list = await res.json();
        const ul = $('ventana-ganador-lista-ganadores');
        ul.innerHTML = '';

        if (list.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Sin puntuaciones';
            li.style.fontStyle = 'italic';
            ul.appendChild(li);
        } else {
            list.forEach((item, i) => {
                const li = document.createElement('li');
                li.className = 'ganador-item';

                const container = document.createElement('div');
                container.className = 'ganador-contenedor';

                const izquierda = document.createElement('span');
                izquierda.className = 'ganador-izquierda';
                izquierda.textContent = `${i + 1}. ${item.nombre}`;

                const derecha = document.createElement('span');
                derecha.className = 'ganador-derecha';
                derecha.textContent = `${item.disparos} disparos`;

                container.appendChild(izquierda);
                container.appendChild(derecha);
                li.appendChild(container);
                ul.appendChild(li);
            });
        }
    } catch (e) {
        console.error('Error cargando puntuaciones en el modal:', e);
    }
}

$('btn-iniciar').onclick = iniciarJuego;
$('close-ventana-ganador').onclick = hideModal;

$('guardar-puntuacion').onclick = async () => {
    const nombre = $('nombre-jugador').value.trim() || 'Jugador Anónimo';

    try {
        await fetch(API + 'guardar-puntuaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, disparos: numDisparos })
        });

        $('nombre-jugador').value = '';
        cargarListadoGanadores();
        cargarListadoGanadoresModal();

        const btn = $('guardar-puntuacion');
        const txt = btn.textContent;
        btn.textContent = 'Guardado';
        setTimeout(() => btn.textContent = txt, 2000);
    } catch (e) {
        console.error('Error guardando puntuación:', e);
        alert('Error al guardar la puntuación');
    }
};


window.onload = iniciarJuego;