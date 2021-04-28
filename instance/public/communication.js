const select = document.querySelector("#select");
const opciones = document.querySelector("#opciones");
const contenidoSelect = document.querySelector("#select .contenido-select");
const date = document.querySelector("#cars");

document.querySelectorAll("#opciones > .opcion").forEach((opcion) => {
  opcion.addEventListener("click", (e) => {
    e.preventDefault();
    contenidoSelect.innerHTML = e.currentTarget.innerHTML;
    select.classList.toggle("active");
    opciones.classList.toggle("active");
  });
});

select.addEventListener("click", () => {
  select.classList.toggle("active");
  opciones.classList.toggle("active");
});

getListWord();

// obtiene la lista de palabras
function getListWord() {
  fetch("/word")
    .then((response) => response.json())
    .then((obj) => {
      words.wordList = obj;
      console.log(obj);
    })
    .catch((error) => console.log(error));
}

var words = new Vue({
  el: "#opciones",
  data() {
    return {
      wordList: [
        "Amazona",
        "Progenitor",
        "Cohete",
        "Verdadero",
        "Lata",
        "Apilar",
        "Dinero",
        "Vecina",
        "Documentos",
        "Circuitos",
      ],
    };
  },
});

let wordInfo = { name: date.value };
console.log(wordInfo);
let options = {
  method: "get",
  headers: { "Content-type": "application/json" },
  body: JSON.stringify(wordInfo),
};
function createVoto() {
  console.log(options);
  fetch("/listword", options)
    .then((response) => response.json())
    .then((data) => console.log(data));
  alert("voto enviado ...");
}

// obtiene la lista de tareas pendientes
function getListTask() {
  fetch("/word")
    .then((response) => response.json())
    .then((obj) => {
      tasks.taskList = obj;
      console.log(obj);
    })
    .catch((error) => console.log(error));
}

var tasks = new Vue({
  el: "#tareasPendienteinfo",
  data() {
    return {
      taskList: [],
    };
  },
});
