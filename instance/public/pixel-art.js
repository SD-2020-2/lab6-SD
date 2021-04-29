'use strict';

const canvas = document.getElementById('pixelart');
const context = canvas.getContext('2d');

// Obtener las dimensiones del canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Numero de filas y de columnas
const numCols = 5;
const numRows = 5;

// Cte para obtener el color del user
const colorPicker = document.getElementById('colorPicker');
// Cte boton enviar pixel
const btnSendPixel = document.getElementById('sendpixel');
btnSendPixel.addEventListener('click', sendPixel);

// variables de posiciones x,y del ultimo pixel dibujado
var x = 0;
var y = 0;
let selectedColor = '';

/**
 * Listener del click para el canvas
 * @param { Event } event
 */
canvas.onclick = (event) => {
	event.preventDefault();

	// Obtiene la informacion del componente como su posicion y tamaño relativos a la ventana principal
	let margin = canvas.getBoundingClientRect();

	// Calcula la posicion x,y del click, dentro del CANVAS
	x = event.clientX - margin.left;
	y = event.clientY - margin.top;
	selectedColor = colorPicker.value;

	drawSquare(colorPicker.value, x, y);
};

window.onload = initAll();

/**
 * Inicia la creacion de todo el pixel art
 */
function initAll() {
	drawGrid(numRows, numCols, 'slateGray');
}

/**
 * Dibuja una linea usando los parametros especificados
 * @param { String } color de la linea a pintar
 * @param { Number } xInitialPoint1 punto inicial en x de la linea (x0)
 * @param { Number } yInitialPoint punto inicial de y (y0)
 * @param { Number } xFinalPoint coordenada donde termina la linea en x (x1)
 * @param { Number } yFinalPoint coordenada donde termina la linea en y (y0)
 */
function drawLine(color, xInitialPoint, yInitialPoint, xFinalPoint, yFinalPoint) {
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = 1;
	context.moveTo(xInitialPoint, yInitialPoint);
	context.lineTo(xFinalPoint, yFinalPoint);
	context.stroke();
	context.closePath();
}

/**
 * Dibuja la grilla del pixelart
 * @param { Number } numCols numero de columnas en la grilla
 * @param { Number } numRows numero de filas para la grilla
 * @param { String } auxcolor el color a pintar la grilla
 */
function drawGrid(auxcolor) {
	let width = canvasWidth / numCols;
	let height = canvasHeight / numRows;
	let color = auxcolor || 'gray';

	// Dibuja las columnas
	for (let i = width; i < canvasWidth; i += width) {
		drawLine(color, i, 0, i, canvasHeight);
	}

	// Dibuja las filas
	for (let i = height; i < canvasHeight; i += height) {
		drawLine(color, 0, i, canvasWidth, i);
	}
}

/**
 * Recorta el espacio dentro de los cuadrados para que se dibuje correctamente
 * @param { Number } num
 * @param { Number } size tamaño del cuadrado
 * @returns
 */
function findIndex(num, size) {
	num = num - (num % size);
	return num === 0 ? num : num + 1;
}

/**
 * Dibuja un cuadrado en la posicion indicada x,y de tamaño relativo a la grilla
 * @param { String } color
 * @param { Number } x
 * @param { Number } y
 */
function drawSquare(color, x, y) {
	context.fillStyle = color;

	// Calcula el tamaño que debe tener cada cuadrado
	let squareWidth = canvasWidth / numCols;
	let squareHeight = canvasHeight / numRows;

	// Calcula la verdadera posicion a dibujar dependiendo de la pos del click
	x = findIndex(x, squareWidth);
	y = findIndex(y, squareHeight);

	// Condicionales ternarios para saber en que posicion se dio el click, vertical u horizontal
	let onVerticalAxis = x === 0 || x === canvasWidth - squareWidth + 1;
	let onHorizontalAxis = y === 0 || y === canvasHeight - squareHeight + 2;

	// Calcula el nuevo ancho y alto del cuadrado dependiendo si esta en un eje vertical u horizontal
	// Todo esto para que no quede sobremontado sobre una linea de la cuadricula
	squareWidth -= onVerticalAxis ? 1 : 2;
	squareHeight -= onHorizontalAxis ? 1 : 2;

	context.fillRect(x, y, squareWidth, squareHeight);
}

/**
 * Envia el objeto pixel a la instancia
 */
function sendPixel() {
	let pixelInfo = {
		x,
		y,
		color: selectedColor,
	};

	let options = {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(pixelInfo),
	};

	console.log(pixelInfo);
	fetch('/pixel', options);
	alert('Pixel enviado para revision ...');

	canvas.classList.add('block-pixel-art');

	setTimeout(() => {
		canvas.classList.remove('block-pixel-art');
	}, 10000);
}
setInterval(() => {
	getListPixel();
}, 4000);

function getListPixel() {
	fetch('/listPixels')
		.then((response) => response.text())
		.then((data) => {
			console.log(data);
			splitInfo(data);
		})
		.catch((err) => console.log(err));
}

//x:250 . y:230 . color:#fffff
function splitInfo(data) {
	let array = data.split(',');
	console.log('split info' + array.length);
	array.forEach(function (elemento) {
		let array2 = elemento.split('|');
		let x = array2[0].split(':')[1];
		let y = array2[1].split(':')[1];
		let color = array2[2].split(':')[1];
		color = color.slice(0, -1);
		drawSquare(color, x, y);
	});
}
