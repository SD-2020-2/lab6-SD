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

1. Construir un sistema distribuido que permite generar una obra de arte en pixel art.

2. Todas las instancias tiene un copia de de la obra y se puede consultar en cada instancia.

3. Para modificar la obra de arte se tiene que tener la mitad más uno de los votos de la red, para eso se hace un PoW.

A. Se solicita a las instancias una palabra (de una lista).

B. Se reunen las palabras y se escoge la que más tenga votos (si hay empate o no hay consenso se vuelve a preguntar).

C. Se registra en tareas pendientes(todos tiene copia de esa lista) quien va a hacer la tarea y cual es la tarea(escribir la palabra en un archivo 100000 veces en nuevas lineas) y el pixel que se quiere modificar y el color.

D. Cuando se cumple el trabajo se tiene que enviar a todos los nodos y estos validan que se haya hecho correctamente. Y si la mitad más uno aprueba entonces se registra el pixel(con un codigo que sea la suma de numeros aletaroios de 0 a 100 generados por cada participante). Cada participante guarda esos numeros.

4. Se puede validar la obra de arte, pedir un certificado a la instancia y la envian al nodo lider y el hace un consenso para verificar si la imagen es real.

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

Y el servidor coordinador funciona en la propia maquina:

- serverCoordinador:
  - http://127.0.0.1:8080

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
