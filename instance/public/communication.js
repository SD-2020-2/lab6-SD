const select = document.querySelector('#select');
const opciones = document.querySelector('#opciones');
const contenidoSelect = document.querySelector('#select .contenido-select');
const date = document.querySelector('#cars');

getListWord();

let wordInfo = { name: date.value };
console.log(wordInfo);
let options = {
	method: 'POST',
	headers: { 'Content-type': 'application/json' },
	body: JSON.stringify(wordInfo),
};

function createVoto() {
	console.log('opciones internas' + options);
	fetch('/wordV', options).then((response) => response.text);
	alert('voto enviado ...');
}

// obtiene la lista de palabras
function getListWord() {
	fetch('/listword')
		.then((response) => response.json())
		.then((obj) => {
			words.wordList = obj;
			console.log(obj);
		})
		.catch((error) => console.log(error));
}

var words = new Vue({
	el: '#cars',
	data() {
		return {
			wordList: [],
		};
	},
});

var tasks = new Vue({
	el: '#tareasPendienteinfo',
	data() {
		return {
			taskList: [],
		};
	},
});
