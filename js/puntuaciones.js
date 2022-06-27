import {
	getDatabase,
	ref,
	set,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';
import { initFireBase } from './firebase.js';

const escribirPuntuacion = (objeto) => {
	const app = initFireBase();
	const db = getDatabase(app);
	set(ref(db, `usuarios/${localStorage.user}/puntuaciones/${Date()}`), objeto);
};

const borrarHistorial=()=>{
const app = initFireBase();
const db = getDatabase(app);
let sustitucion = '';
set(ref(db, `usuarios/${localStorage.user}/puntuaciones/`),sustitucion);
}
export { escribirPuntuacion,borrarHistorial };
