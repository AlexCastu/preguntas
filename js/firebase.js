import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import {
	getDatabase,
	ref,
	onValue,
	set,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';
import {
	getAuth,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js';
import { mostrarPreguntasYRespuestas } from './functions.js';

function iniciarFireBase() {
	const app = initFireBase();
	getData(app);
}

window.addEventListener('load', () => {
	document.createElement(`div`);
	document.getElementById('iniciarSesion').addEventListener('click', (e) => {
		e.preventDefault();
		loginUser();
	});
	document.getElementById('registrarse').addEventListener('click', (e) => {
		e.preventDefault();
		document.getElementById('containerIniciarSesion').style.display = 'none';
		document.getElementById('containerRegistrarse').style.display = 'flex';

		document
			.getElementById('registrarUsuario')
			.addEventListener('click', (e) => {
				e.preventDefault();
				const app = initFireBase();
				if (comprobarDatosIntroducidosRegistro()) {
					signUpUser(app);
					document.getElementById('registrarUsuario').style.boxShadow =
						'0px 0px 10px rgb(16, 146, 59)';
					setTimeout(() => {
						document.getElementById("containerIniciarSesion").style.display =
              "flex";
            document.getElementById("containerRegistrarse").style.display =
              "none";
					}, 1000);
				} else {
					document.getElementById('registrarUsuario').style.boxShadow =
						'0px 0px 10px red';
				}
			});
	});
});

function loginUser() {
	const app = initFireBase();
	const auth = getAuth(app);
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const email = document.getElementById('user').value;
	const pass = document.getElementById('contrasenia').value;
	const formulario = document.getElementById('formularioIniciarSesion');

	let error = document.getElementById('parrafoErrorDatos');
	if (
		emailRegex.test(formulario.user.value) &&
		formulario.contrasenia.value.length > 3
	) {
		signInWithEmailAndPassword(auth, email, pass)
			.then((response) => {
				document.getElementById('opcionesLocalStorage').style.display = 'flex';
				document.getElementById('seccionCategorias').style.display = 'flex';
				document.getElementById('containerIniciarSesion').style.display =
					'none';
				localStorage.setItem('user', response.user.uid);
			})
			.catch((err) => {
				console.log(err);
				error.innerHTML = '';
				error.innerHTML =
					'Usuario no registrado, compurebe los datos o registrese';
				error.style.display = 'flex';
			});
	} else {
		error.innerHTML = '';
		error.innerHTML = 'Los datos introducidos son erroneos';
		error.style.display = 'flex';
	}
}

const comprobarDatosIntroducidosRegistro = () => {
	let retorno = true;
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const form = document.getElementById('formularioRegistro');
	if (form.nombre.value.length < 2) {
		alert('Introduce un nombre valido');
		retorno = false;
	} else if (form.edad.value <= 0) {
		alert('La edad no puede ser menos o igual a 0');
		retorno = false;
	} else if (form.direccion.value.length < 2) {
		alert('Direccion Incorrecta');
		retorno = false;
	} else if (!emailRegex.test(form.email.value)) {
		alert('El email es erroneo, insertalo de nuevo');
		retorno = false;
	}
	return retorno;
};
function signUpUser(app) {
	const form = document.getElementById('formularioRegistro');
	const email = form.email.value;
	const nombre = form.nombre.value;
	const direccion = form.direccion.value;
	const edad = form.edad.value;
	const pass = form.contraseniaRegistro.value;
	const pass2 = form.contraseniaRegistro2.value;
	const auth = getAuth(app);

	if (pass !== '' && pass2 !== '' && pass === pass2) {
		createUserWithEmailAndPassword(auth, email, pass)
			.then((response) => {
				escribirUsuario(response.user.uid, nombre, email, edad, direccion);
			})
			.catch((error) =>
				alert(
					'No ha sido posible darte de alta, comprueba los datos',
					error.code,
					error.message
				)
			);
	} else {
		alert('Las contraseñas introcudidas no coinciden');
	}
}
function escribirUsuario(userId, nombre, email, edad, direccion) {
	let puntuaciones = '';
	const app = initFireBase();
	const db = getDatabase(app);
	set(ref(db, 'usuarios/' + userId), {
		userId,
		nombre,
		email,
		edad,
		direccion,
		puntuaciones,
	});
}
const initFireBase = () => {
	const firebaseConfig = {
		apiKey: 'AIzaSyAOGxssHLEbf5qBuugPyVmjBS61gIi3sa8',
		authDomain: 'preguntasquiz.firebaseapp.com',
		databaseURL:
			'https://preguntasquiz-default-rtdb.europe-west1.firebasedatabase.app',
		projectId: 'preguntasquiz',
		storageBucket: 'preguntasquiz.appspot.com',
		messagingSenderId: '754646889454',
		appId: '1:754646889454:web:d972c1f2a948a220f594ff',
	};
	return initializeApp(firebaseConfig);
};

function getData(app) {
	const database = getDatabase(app);
	const refPreguntas = ref(database, 'results/');

	onValue(refPreguntas, (snapshot) => {
		const data = snapshot.val();
		mostrarPreguntasYRespuestas(data);
	});
}
const cerrarSesionFirebase = () => {
	const app = initFireBase();
	const auth = getAuth(app);
	signOut(auth)
		.then(() => {
			alert('Sesion cerrada.');
		})
		.catch((error) => {
			alert('A ocurrido un error, pongase en contacto con el administrador.');
		});
};
export { iniciarFireBase, getData, initFireBase, cerrarSesionFirebase };
