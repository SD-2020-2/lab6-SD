# Laboratorio 5 - Sistemas Distribuidos

## Contenido

- [Arquitectura](#arquitectura)
- [Enunciado](#enunciado)
- [¿ Cómo usar este proyecto ?](#usar-este-proyecto)
  - [Construir el proyecto](#construir-el-proyecto)
  - [Networking del proyecto](#network-proyecto)
- [Dependencias](#dependencias)
  - [Instancia](#dependencias-instancia)
  - [Middleware](#dependencias-middleware)
- [Desarrolladores](#desarrolladores)

## Arquitectura

Arquitectura

## Enunciado

Hacer una simulación del algoritmo de bully leader

1. **Hay varios servidores y cada un tiene su interfaz de consulta Web.**

2. **Se debe tener la lista de servidores cada uno con un id y saber quien es el lider. Si se agrega un nuevo server este debe quedar registrado (crear nueva instancia).**
3. **El primer nodo que se conecta es el lider.** El lider debe tener un boton para detener la instancia.

4. **Los servidores deben hacer un latido al lider cada cierto tiempo aleatorio, el primero que detecta ese evento debe iniciar la elección.**

5. **Se debe informar a los demás que se va a cambiar el lider para que suspendan los latidos.**

6. **Se ejecuta el algoritmo y cuando se termina se notifica el cambio de lider.**

7. Se deben registrar los logs de todas las peticiones que se hagan en el sistema y sus respuestas.

## Usar este proyecto

El uso de este proyecto se explica a continuación:

### Construir el proyecto

Instala las dependencias del middleware, ubicandote en la carpeta middleware

```
npm install
```

Inicia el middleware

```
node index.js
```

Ve a localhost:3000 para ver el sitio web del middleware

```
http://localhost:3000
```

### Network proyecto

Se crea un contenedor por cada instancia, por ejemplo:

- instance1:
  - http://172.17.0.2:8080
- instance2:
  - http://172.17.0.3:8080

## Dependencias

Detalle de las dependencias del proyecto:

### Dependencias instancia

```
"axios": "^0.21.1",
"body-parser": "^1.19.0",
"express": "^4.17.1"
```

### Dependencias middleware

```
"axios": "^0.21.1",
"express": "^4.17.1
```

## Desarrolladores

- [Mati Rodriguez](https://github.com/limarosa29)
- [Christian Chamorro](https://github.com/cris2014971130)
- [Oscar Rojas](https://github.com/augusticor)
- [Santiago Sosa](https://github.com/SantiagoSosa12)
