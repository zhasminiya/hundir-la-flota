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

// para poder obtener elementos del DOM fácilmente
const $ = id => document.getElementById(id);

// Variable para guardar la eleccion entre colores o iconos
let usarIconos = true; // true = iconos, false = colores

// Función para mostrar el modal de preferencias
function mostrarModalPreferencias() {
    const modal = $('modal-preferencias');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Función para ocultar el modal de preferencias
function ocultarModalPreferencias() {
    const modal = $('modal-preferencias');
    if (modal) {
        modal.classList.add('hidden');
    }
}



// Función para iniciar el juego
async function iniciarJuego() {
    //para errores habilitar los console
    //console.log('URL fetch:', API + 'iniciar-juego.php');

    try {
        // Reinicio de variables y estado del juego
        numDisparos = 0;
        juegoTerminado = false;
        $('recuento').textContent = numDisparos;// Reinicia el contador de disparos
        $('estado-del-juego').innerHTML = '';// Borra los mensajes anteriores

        // Habilitamos el botón de guardar puntuación
        $('guardar-puntuacion').disabled = false;

        // Creamos un nuevo tablero
        const response = await fetch(API + 'iniciar-juego.php');
        //console.log('Response status:', response.status);

        // Leo la respuesta
        const text = await response.text();
        //console.log('Response text:', text);

        // Si la respuesta no es correcta (200), damos un error
        if (!response.ok) throw new Error('HTTP ' + response.status);

        // Parseo la respuesta JSON
        const data = JSON.parse(text);
        tablero = data.tablero; // Tablero inicial vacío
        barcos = data.barcos; // Información de los barcos

        // Dibujamos el tablero
        PintarTablero();

        // Escribimos la lista de barcos con su estado
        pintarEstadoFlota();

        // Ocultamos el modal de ganador por si estubiera abierto
        hideModal();

        // Escribimos lista de ganadores actual
        cargarListadoGanadores();

        // Mostrar mensaje en la barra de mensajes estado del juego
        pasos('Juego iniciado');
    } catch (error) {
        // En caso de error, lo mostramos por la consola, en la pantalla y con una alerta modal
        pasos('Error al iniciar el Juego');
        console.error('Error iniciando juego:', error);
        alert('Error al iniciar el juego. Verifica que el servidor PHP esté funcionando.');
    }
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
            celda.dataset.y = y;           // Para guardar las coordenadas Y
            celda.addEventListener('click', onCellClick); // El evento click en la celda
            container.appendChild(celda);  // Ponemos la celda en el tablero
        }
    }
}


// Función para mostrar el estado de la flota
function pintarEstadoFlota() {
    const status = $('estado-flota');
    status.innerHTML = ''; // Borrar la lista anterior

    // Recorro cada barco para mostrar su estado
    barcos.forEach((ship, i) => {
        const li = document.createElement('li');
        const name = nombreBarcos[i] || `Barco ${i + 1}`;

        // para poder añadir css al nombre del barco
        const spanNombre = document.createElement('span');
        spanNombre.textContent = name;

        // para poder añadir css al tamaño del barco
        const spanCasillas = document.createElement('span');
        spanCasillas.textContent = `(${ship.longitud} casillas)`;

        // Agrego nombre y tañamo al <li>
        li.appendChild(spanNombre);
        li.appendChild(document.createTextNode(' ')); // Espacio
        li.appendChild(spanCasillas);

        // Asigno una clase para los colores según el estado del barco
        li.className = ship.impactos === ship.longitud
            ? 'hundido'   // Si tiene todos los impactos
            : ship.impactos > 0
                ? 'tocado' // Si tiene algún impacto
                : 'agua';// Si no tiene impactos

        // Agrego el <li> al listado de estado de flota
        status.appendChild(li);
    });
}


// Función para mostrar los mensajes del estado del juego
function pasos(mensaje) {
    const estadoDelJuego = $('estado-del-juego');
    estadoDelJuego.textContent = mensaje;
}


// Función para manejar las pulsaciones de las celdas del tablero
function onCellClick(e) {
    if (juegoTerminado) return; // Si ha terminado el juego no hacemos click

    const x = +e.target.dataset.x; // Coordenada X del clic
    const y = +e.target.dataset.y; // Coordenada Y del clic

    // Si en esa celda ya hemos pinchado no hacemos click
    if (tablero[y][x] !== 0) return;

    // Aumentamos el contador de disparos
    numDisparos++;
    $('recuento').textContent = numDisparos;

    // Miramos si el disparo impacta en algún barco
    const idx = barcos.findIndex(s =>
        s.coordenadas.some(c => c[0] === x && c[1] === y)
    );

    // Si no damos en ningún barco
    if (idx === -1) {
        tablero[y][x] = -1; // Lo marcamos como fallo
        e.target.classList.add('agua'); // Cambiamos el color color con CSS

        // Si estamos usando iconos, añadimos el icono y animación
        if (usarIconos) {
            e.target.textContent = '💧';
            e.target.classList.add('animacion-impacto');
        }

        // Mostrar mensaje en la barra de mensajes estado del juego
        pasos(`Agua`);
    } else {
        // Si acertamos en un barco
        tablero[y][x] = idx + 1; // Marcamos el barco con impacto
        barcos[idx].impactos++; // Aumentamos los impactos del barco
        e.target.classList.add('tocado');

        // Si estamos usando iconos, añadimos el icono y animación
        if (usarIconos) {
            e.target.textContent = '🔥';
            e.target.classList.add('animacion-impacto');
        }

        // Mostrar mensaje en la barra de mensajes estado del juego
        pasos(`Impacto en ${nombreBarcos[idx]}`);

        // Si hemos hundido el barco
        // si los impactos son iguales a la longitud
        if (barcos[idx].impactos === barcos[idx].longitud) {
            // Marcamos todas sus celdas como hundidas 
            barcos[idx].coordenadas.forEach(([cx, cy]) => {
                const celda = document.querySelector(`.celda[data-x="${cx}"][data-y="${cy}"]`);
                if (celda) {
                    celda.classList.replace('tocado', 'hundido');

                    // Si estamos usando iconos, añadimos el icono y animación
                    if (usarIconos) {
                        celda.textContent = '💥';
                        celda.classList.add('animacion-hundido');
                    }

                }
            });
            // Mostrar mensaje en la barra de mensajes estado del juego
            pasos(`${nombreBarcos[idx]} hundido`);
        }

        // Actualizo el estado de la flota
        pintarEstadoFlota();

        // Compruebo si se han hundido todos los barcos
        comprobarGanador();
    }
}


// Funcion para comprobar si alguien ha ganado
function comprobarGanador() {
    // Si todos los barcos tienen los impactos iguales a su longitud
    if (barcos.every(s => s.impactos === s.longitud)) {
        juegoTerminado = true;
        // Mostrar mensaje en la barra de mensajes estado del juego
        pasos(`¡Eres el Ganador! - Flota hundida en ${numDisparos} disparos`);
        $('total-disparos').textContent = numDisparos;
        showModal();  // Mostramos la ventana modal del ganador
        cargarListadoGanadoresModal(); // Actualizamos la lista de ganadores en la ventana modal
    }
}


// mostrar/ocultar la ventana modal del ganador
const showModal = () => $('ventana-ganador').classList.remove('hidden');
const hideModal = () => $('ventana-ganador').classList.add('hidden');


// Fución para cargar la lista de los ganadores en la barra lateral
async function cargarListadoGanadores() {
    try {
        const res = await fetch(API + 'puntuaciones.php');
        const data = await res.json();
        const list = data.puntuaciones || [];

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
                li.className = 'ganador-item'; //Añade clase CSS

                // Crear contenedor con flexbox
                const container = document.createElement('div');
                container.className = 'ganador-contenedor'; //Clase para flexbox

                // Número y nombre alineados a la izquierda
                const izquierda = document.createElement('span');
                izquierda.className = 'ganador-izquierda';
                izquierda.textContent = `${i + 1}. ${item.nombre}`;

                // Disparos alineados a la derecha
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



// Fución para cargar la lista de los ganadores en la ventana modal
async function cargarListadoGanadoresModal() {
    try {
        const res = await fetch(API + 'puntuaciones.php');
        const data = await res.json();
        const list = data.puntuaciones || [];

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
                li.className = 'ganador-item'; //Añade clase CSS

                // Crear contenedor con flexbox
                const container = document.createElement('div');
                container.className = 'ganador-contenedor'; //Clase para flexbox

                // Número y nombre alineados a la izquierda
                const izquierda = document.createElement('span');
                izquierda.className = 'ganador-izquierda';
                izquierda.textContent = `${i + 1}. ${item.nombre}`;

                // Disparos alineados a la derecha
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

// Mostrar modal de preferencias al cargar la página
mostrarModalPreferencias();

// Botones del modal de preferencias
const btnColores = $('preferencias-colores');
const btnIconos = $('preferencias-iconos');

if (btnColores) {
    btnColores.onclick = () => {
        usarIconos = false;
        ocultarModalPreferencias();
        iniciarJuego();
    };
}

if (btnIconos) {
    btnIconos.onclick = () => {
        usarIconos = true;
        ocultarModalPreferencias();
        iniciarJuego();
    };
}

// Nueva partida
const btnIniciar = $('btn-iniciar');
if (btnIniciar) {
    btnIniciar.onclick = mostrarModalPreferencias;
}

// Cerrar la ventana modal del ganador
$('close-ventana-ganador').onclick = hideModal;

// Guardar la puntuación del jugador ganador
$('guardar-puntuacion').onclick = async () => {
    const nombre = $('nombre-jugador').value.trim() || 'Jugador Anónimo';
    console.log('Nombre a guardar:', nombre, 'Disparos:', numDisparos);

    const btn = $('guardar-puntuacion');

    try {
        // Deshabilitamos el botón para evitar múltiples clicks
        btn.disabled = true;

        // Enviamos el nombre y número de disparos al backend
        await fetch(API + 'guardar-puntuaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, disparos: numDisparos })
        });

        // Limpiamos el campo de nombre y actualizamos las listas
        $('nombre-jugador').value = '';
        cargarListadoGanadores();
        cargarListadoGanadoresModal();

        // Cambiamos durante 2 segundos el texto del botón a "Guardado"
        //y bloqueamos el botón para que no guarde más
        const txt = btn.textContent;
        btn.textContent = 'Guardado';
        setTimeout(() => btn.textContent = txt, 2000);
    } catch (e) {
        console.error('Error guardando puntuación:', e);
        alert('Error al guardar la puntuación');
        btn.disabled = false;
    }
};

// Al cargar la página iniciamos automáticamente el juego
window.onload = iniciarJuego;