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

// obtiene la lista de tareas pendientes
// obtiene la lista de usuarios

var task = new Vue({
	el: '#taskInfo',
	data() {
		return {
			taskList: [],
		};
	},
});

function sendCertificate() {
	let options = {
		method: 'GET',
		headers: { 'Content-type': 'application/json' },
	};

	fetch('/certificado', options).then((response) => response.json());
	alert('Certificacion enviada al lider para revision ...');
}

setInterval(() => {
	fetch('/listask')
		.then((response) => response.json())
		.then((obj) => {
			task.taskList = obj;
			console.log(obj);
		})
		.catch((error) => console.log(error));
}, 5000);
