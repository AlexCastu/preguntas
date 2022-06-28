import { initFireBase } from './firebase.js';
import {
	getDatabase,
	ref,
	onValue,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';

const mostrarDatosUserFirebase = () => {
  iniciarFireBase();
};
function iniciarFireBase() {
  const app = initFireBase();
  getData(app);
}
const getData = (app) => {
  const database = getDatabase(app);
  const refPreguntas = ref(database, "usuarios/" + localStorage.user);
  onValue(refPreguntas, (snapshot) => {
    const data = snapshot.val();
    console.log(data.nombre);
    setTimeout(() => {
      document.getElementById("usuarioFirebase").innerText = data.nombre;
    }, 1000);
  });
};
export { mostrarDatosUserFirebase };
