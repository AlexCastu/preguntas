import { initFireBase } from "./firebase.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
const mostrarUsariosFirebase = () => {
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
    document.getElementById("modalNombre").innerText = data.nombre;
    document.getElementById("modalEdad").innerText = data.edad;
    document.getElementById("modalDireccion").innerText = data.direccion;
    document.getElementById("modalEmail").innerText = data.email;
    document.getElementById("wrapperModal").style.display = "flex";
    document.getElementById("botonCerrarModal").addEventListener('click',()=>{
         document.getElementById("wrapperModal").style.display = "none";
    });
  });
};
export { mostrarUsariosFirebase };
