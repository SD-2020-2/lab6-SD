// getserverinfo();
// tabla
/*function getserverinfo() {
	fetch('/instancestatus')
		.then((response) => response.json())
		.then((obj) => (servidores.serversList = obj))
		.catch((error) => console.log(error));
}*/

var servidores = new Vue({
	el: '#servidoresinfo',
	data() {
		return {
			serversList: [],
		};
	},
});

/*let options = {
  method: "POST",
  headers: { "Content-type": "application/json" },
};
function createInstance() {
  fetch("/instance", options)
    .then((response) => response.text())
    .catch((error) => console.log(error));
  alert("Creando instancia ...");
}*/
