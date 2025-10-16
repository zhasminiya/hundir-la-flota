# Hundir-la-flota 🚢💥

## 🧭 Descripción del Proyecto

**Hundir-la-flota** es una versión web del clásico juego de estrategia naval.  
El proyecto combina **PHP** en el backend con **JavaScript** en el frontend, siguiendo principios de **desarrollo ágil** y **buenas prácticas de programación web**.

---

## 🚀 Funcionalidades Principales

- **API REST en PHP** para manejar las partidas y puntuaciones.  
- **Interfaz adaptable (responsive)** para jugar desde cualquier dispositivo.  
- **Sistema de puntuaciones** con guardado y consulta de resultados.  
- **Arquitectura modular**, fácil de mantener y ampliar.  

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: PHP 7.4+ y manejo de datos en formato JSON  
- **Frontend**: HTML5, CSS3 y JavaScript (ES6+)  
- **Control de versiones**: Git y GitHub  
- **Servidor local**: XAMPP o WAMP  

---

## 📂 Estructura del Proyecto
```
hundir-la-flota/
├── backend/
│ ├── iniciar_partida.php # Inicia una nueva partida
│ ├── guardar_puntuacion.php # Guarda las puntuaciones
│ ├── obtener_puntuaciones.php # Devuelve el ranking de jugadores
│ └── puntuaciones.json # Archivo de almacenamiento
├── frontend/
│ ├── index.html # Página principal del juego
│ ├── css/
│ │ └── estilo.css # Hojas de estilo
│ ├── js/
│ │ └── juego.js # Lógica del tablero y disparos
│ └── assets/ # Imágenes e iconos del juego
├── .gitignore # Archivos ignorados por Git
└── README.md # Documentación principal
```

## ⚙️ Instalación y Configuración

### 🔧 Requisitos Previos

- Tener instalado un servidor local (**XAMPP**, **WAMP**, o similar)  
- **PHP versión 7.4 o superior**  
- **Navegador web actualizado**  

### 🪜 Pasos para Ejecutar el Proyecto

1. **Clonar el repositorio:**
```
git clone https://github.com/zhasminiya/hundir-la-flota.git
```
Configurar en el servidor local:

Copia la carpeta del proyecto a htdocs (XAMPP) o www (WAMP).

Asegúrate de que el servicio Apache esté en ejecución.

Abrir el juego en el navegador:
http://localhost/hundir-la-flota/

👥 Equipo de Desarrollo
Scrum Master: Eugenia Kostiukovskaia Essitachvili

Backend Developer: Eugenia Kostiukovskaia Essitachvili

Frontend Developer: Antonio Moreno

Tercer miembro: (por asignar)

📄 Licencia
Este proyecto se distribuye bajo la Licencia MIT.
Consulta el archivo LICENSE para más información.
