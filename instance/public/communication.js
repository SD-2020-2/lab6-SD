const select = document.querySelector('#select');
const opciones = document.querySelector('#opciones');
const contenidoSelect = document.querySelector('#select .contenido-select');
const date = document.querySelector('#cars');

function createVoto() {
	let wordInfo = { name: date.value };
	console.log(wordInfo);
	let options = {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.parse(wordInfo),
	};

	fetch('/wordV', options).then((response) => response.json());
	alert('voto enviado ...');
}

var buttonsa = new Vue({
	el: '#buttons',
	methods: {
		actualizar: () => {
			createVoto();
		},
	},
});
