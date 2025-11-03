# Hundir-la-flota 🚢💥

## 🧭 Descripción del Proyecto

**Hundir-la-flota** es una versión web del clásico juego de estrategia naval.  
El proyecto combina **PHP** en el backend con **JavaScript** en el frontend, siguiendo principios de **desarrollo ágil** y **buenas prácticas de programación web**.

---

## 🚀 Funcionalidades Principales

- **Backend PHP** con endpoints para gestión del juego
- **Interfaz adaptable (responsive)** para jugar desde cualquier dispositivo  
- **Sistema de ranking** con guardado y consulta de resultados en JSON
- **Arquitectura cliente-servidor** separando frontend y backend 

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: PHP con endpoints para el juego
- **Frontend**: HTML5, CSS3, JavaScript (ES6+) 
- **Persistencia**: JSON para almacenamiento de scores
- **Comunicación**: Fetch API para peticiones asíncronas
- **Control de versiones**: Git y GitHub
- **Servidor local**: XAMPP para desarrollo y pruebas

---

## 📂 Estructura del Proyecto
```
hundir-la-flota/
├── backend/
│ ├── iniciar-juego.php # Inicia una nueva partida
│ ├── guardar-puntuaciones.php # Guarda las puntuaciones
│ ├── puntuaciones.php # Devuelve el ranking de jugadores
│ └── puntuaciones.json # Archivo de almacenamiento
├── index.html # Página principal del juego
├── css/
│ └── estilo.css # Hojas de estilo
├── js/
│ └── app.js # Lógica del tablero y disparos
├── imagenes/
│ └── xxxxx # diversas imagenes para el juego
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

Backend Developer: Eugenia Kostiukovskaia Essitachvili  

Frontend Developer: Antonio Moreno Castillo

📄 Licencia
Este proyecto se distribuye bajo la Licencia MIT.
Consulta el archivo LICENSE para más información.
