import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import {
	getDatabase,
	ref,
	onValue,
	set,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';
import {
	getAuth,
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
				signUpUser(app);
			});
	});
});

function loginUser() {
	const app = initFireBase();
	const auth = getAuth(app);
	const email = document.getElementById('user').value;
	const pass = document.getElementById('contrasenia').value;
	//funcion para loguearse
	signInWithEmailAndPassword(auth, email, pass)
		.then((response) => {
			document.getElementById('opcionesLocalStorage').style.display = 'flex';
			document.getElementById('seccionCategorias').style.display = 'flex';
			document.getElementById('containerIniciarSesion').style.display = 'none';
			localStorage.setItem('user', response.user.uid);
			location.reload();
		})
		.catch((error) => alert(error.code, error.message));
}

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
		alert('las contraseñas no coinciden');
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

export { iniciarFireBase, getData, initFireBase };
