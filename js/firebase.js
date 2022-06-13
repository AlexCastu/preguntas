import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';
import { mostrarPreguntasYRespuestas } from './functions.js';

function iniciarFireBase() {
  const app = initFireBase();
  getData(app);
}

const initFireBase = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyAOGxssHLEbf5qBuugPyVmjBS61gIi3sa8',
    authDomain: 'preguntasquiz.firebaseapp.com',
    databaseURL: 'https://preguntasquiz-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'preguntasquiz',
    storageBucket: 'preguntasquiz.appspot.com',
    messagingSenderId: '754646889454',
    appId: '1:754646889454:web:d972c1f2a948a220f594ff',
    measurementId: 'G-P4XX8CXSM4',
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

export { iniciarFireBase };
