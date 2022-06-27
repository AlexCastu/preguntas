import { initFireBase } from './firebase.js';
import {
	getDatabase,
	ref,
	onValue,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';

const mostrarPuntuacionesUser = () => {
	iniciarFireBase();
};
function iniciarFireBase() {
	const app = initFireBase();
	getData(app);
}

const getData = (app) => {
	const database = getDatabase(app);
	const refPreguntas = ref(
		database,
		`usuarios/${localStorage.user}/puntuaciones`
	);
	onValue(refPreguntas, (snapshot) => {
		const data = snapshot.val();
		mostrarPuntuaciones(data);
	});
};

const mostrarPuntuaciones = (data) => {
	document.getElementById('contenedorSesionesAnteriores')
		? document.getElementById('contenedorSesionesAnteriores').remove()
		: null;
	// comporobar local Host
	if (data) {
		const keys = Object.keys(data);
		data.length > 5 ? (data = data.slice(-5)) : null;
		// div titulo y boton
		const contenedorTitulo = document.createElement('div');
		contenedorTitulo.id = 'contenedorTitulo';
		let h2 = document.createElement('h2');
		h2.innerHTML = 'Sesiones anteriores';
		let botonSalir = document.createElement('button');
		botonSalir.id = 'botonSalirLocalStorage';
		let imgSalir = document.createElement('img');
		imgSalir.src = './img/salirBoton.png';
		botonSalir.appendChild(imgSalir);
		contenedorTitulo.append(h2, botonSalir);

		// contenedor general
		const div = document.createElement('div');
		div.id = 'contenedorSesionesAnteriores';
		////////////

		// div para cada una de las sesiones
		const divAnterioresSesiones = document.createElement('div');
		divAnterioresSesiones.id = 'contenedorSesiones';
		const divTitulo = document.createElement('div');
		divTitulo.id = 'titulosCategorias';
		const pAciertos = document.createElement('p');
		pAciertos.innerHTML = 'Aciertos';
		const pCategoria = document.createElement('p');
		pCategoria.innerHTML = 'Categoria';
		const tiempo = document.createElement('p');
		tiempo.innerHTML = 'Fecha';
		tiempo.title = 'Fecha y Hora';
		divTitulo.append(pAciertos, pCategoria, tiempo);

		keys.forEach((objeto) => {
		 	let element = data[objeto];
			let divEach = document.createElement('div');
			divEach.className = 'sesiones';
			let divAciertos = document.createElement('div');
			let divImagen = document.createElement('div');
			let pA = document.createElement('p');
			pA.innerHTML = element.aciertos;
			pA.style.color = element.aciertos > 4 ? 'green' : 'red';
			let pI = document.createElement('img');
			if (element.cat === 18) {
				pI.src = './img/info.png';
				pI.title = 'Informatica';
			} else if (element.cat === 11) {
				pI.src = './img/cine.png';
				pI.title = 'Cine';
			} else if (element.cat === 12) {
				pI.src = './img/musica.png';
				pI.title = 'Musica';
			} else if (element.cat === 10) {
				pI.src = './img/random.png';
				pI.title = 'Aleatoria';
			} else {
				pI.src = './img/firebase.png';
				pI.title = 'Firebase';
			}
			let contenedorFecha = document.createElement('div');
			contenedorFecha.id = 'contenedorFecha';
			let fecha = document.createElement('p');
			fecha.id = 'pfecha';
			fecha.innerHTML = element.fecha;
			let horas = document.createElement('p');
			horas.innerHTML = element.horas;
			divAciertos.appendChild(pA);
			divImagen.appendChild(pI);
			contenedorFecha.append(horas, fecha);
			divEach.append(divAciertos, divImagen, contenedorFecha);
			divAnterioresSesiones.append(divEach);
			divAnterioresSesiones.append(divTitulo);
		});

		div.append(contenedorTitulo);
		div.append(divAnterioresSesiones);

		var padre = document.getElementById('contenedorMain');
		var referencia = document.getElementById('seccionCategorias');
		padre.insertBefore(div, referencia);

		inciarBoton();
		verGrafica(keys,data);
	} else {
		alert('No hay ninguna sesion guardada');
	}
};

const inciarBoton = () => {
	document
		.getElementById('botonSalirLocalStorage')
		.addEventListener('click', () => {
			document
				.getElementById('botonSalirLocalStorage')
				.parentElement.parentElement.remove();
		});
};

const verGrafica = (keys, datosFirebase) => {
  const div = document.createElement("div");
  div.id = "contenedorGrafica";
  const canvas = document.createElement("canvas");
  canvas.id = "myChart";
  canvas.style.width = "400px";
  div.append(canvas);

  let puntuaciones;
  let categoria;
  let colores;

  if (keys.length > 0) {
    puntuaciones = keys.map((element) => {
      return datosFirebase[element].aciertos;
    });
    categoria = keys.map((elemento) => {
		let element = datosFirebase[elemento].cat;
      if (element.cat === 18) {
        return "Informatica";
      } else if (element.cat === 11) {
        return "Cine";
      } else if (element.cat === 12) {
        return "Musica";
      } else if (element.cat === 10) {
        return "Aleatoria";
      } else {
        return "Firebase";
      }
    });

    colores = keys.map((element) => {
       return datosFirebase[element].aciertos >= 5 ? "rgba(15, 148, 8) " : "rgba(225, 48, 48)";
    });
  }

  const data = {
    labels: categoria,
    datasets: [
      {
        label: "Fallos",
        backgroundColor: colores,
        borderColor: "rgb(255, 99, 132)",
        data: puntuaciones,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      min: 0,
      max: 10,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  document.getElementById("contenedorSesionesAnteriores").appendChild(div);
  const myChart = new Chart(document.getElementById("myChart"), config);
};
export { mostrarPuntuacionesUser };
