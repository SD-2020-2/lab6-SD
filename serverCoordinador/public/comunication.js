//Obtiene los logs de la instancia 1
getLogs(2);

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

// ----------------------------
// Pestañas logs
Vue.component('tabs', {
	template: `
        <div>
        	<div class="tabs">
            	<ul>
            		<li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                		<a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
            		</li>
            	</ul>
            </div>

            <div class="tabs-details">
                <slot></slot>
            </div>
        </div>
    `,

	data() {
		return { tabs: [] };
	},

	created() {
		this.tabs = this.$children;
	},
	methods: {
		selectTab(selectedTab) {
			this.tabs.forEach((tab) => {
				tab.isActive = tab.name == selectedTab.name;
			});
			getLogs(parseInt(selectedTab.name.slice(-1)) + 1);
		},
	},
});

Vue.component('tab', {
	template: `

        <div v-show="isActive"><slot></slot></div>

    `,

	props: {
		name: { required: true },
		selected: { default: false },
	},

	data() {
		return {
			isActive: false,
		};
	},

	computed: {
		href() {
			return '#' + this.name.toLowerCase().replace(/ /g, '-');
		},
	},

	mounted() {
		this.isActive = this.selected;
	},
});

let serverData = {
	logs: [],
};

var tabla = Vue.component('tabla', {
	template: `
		<table id="logs">
			<tr>
				<th scope="col">Log Type</th>
				<th scope="col">Fecha</th>
				<th scope="col">Mensaje</th>
			</tr>

			<tr v-for="log in logs">
				<td>{{log.type}}</td>
				<td>{{log.date}}</td>
				<td>{{log.message}}</td>
			</tr>
		</table>
	`,
	data() {
		return serverData;
	},
});

new Vue({
	el: '#root',
});

/**
 * Obtiene los logs de la instancia especificada (2,3,4)
 * @param { Number } id
 */
function getLogs(id) {
	fetch(`/logs/${id}`)
		.then((response) => response.json())
		.then((obj) => (serverData.logs = obj))
		.catch((error) => console.log(error));
}
