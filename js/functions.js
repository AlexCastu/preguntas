window.addEventListener('load', () => {
  if (!localStorage.Acertados) {
    localStorage.setItem('Acertados', 0);
  } else {
    localStorage.Acertados = 0;
  }

  //guardamos algunos de los elementos que usaremos de forma repetitiva
  // Seleccionamos los botones y les añadimos en addeventListener
  document.getElementById('botonCategoriaInformatica').addEventListener('click', () => {
    seleccionarCategoria(18);
  });
  document.getElementById('botonCategoriaCine').addEventListener('click', () => {
    seleccionarCategoria(11);
  });
  document.getElementById('botonCategoriaMusica').addEventListener('click', () => {
    seleccionarCategoria(12);
  });
  document.getElementById('botonCategoriaAleatoria').addEventListener('click', () => {
    seleccionarCategoria(10);
  });

  const seleccionarCategoria = (categoria) => {
    let seccionCategorias = document.getElementById('seccionCategorias');
    seccionCategorias.style.display = 'none';
    mostrarIntro(categoria);
  };

  const mostrarIntro = (id_categoria) => {
    let div = document.createElement('div');
    div.id = 'intermediarioSeleccionCategoria';
    let botonVolver = document.createElement('button');
    botonVolver.innerHTML = ' Volver';
    botonVolver.id = 'volverHome';
    let botonEmpezar = document.createElement('button');
    botonEmpezar.id = 'botonJugar';
    let texto = document.createElement('p');
    if (id_categoria === 18) {
      botonEmpezar.style.backgroundImage = ' linear-gradient(to top, #9890e3 0%, #b1f4cf 100%)';
      document.getElementById('wrapper').style.backgroundImage = ' linear-gradient(to top, #9890e3 0%, #b1f4cf 100%)';
      texto.innerHTML = 'Has elegido la categoria de Informatica! Si estas preparado para este reto dale a jugar! ';
    } else if (id_categoria === 11) {
      botonEmpezar.style.backgroundImage = 'linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)';
      document.getElementById('wrapper').style.backgroundImage = ' linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)';
      texto.innerHTML = 'Has elegido la categoria de Cine! Demuestra que eres un autentico cinefilo! ';
    } else if (id_categoria === 12) {
      botonEmpezar.style.backgroundImage = 'linear-gradient(to top, #96fbc4 0%, #f9f586 100%)';
      document.getElementById('wrapper').style.backgroundImage = ' linear-gradient(to top, #96fbc4 0%, #f9f586 100%)';
      texto.innerHTML = 'Has elegido la categoria de Musica! Mozart?...Beethoven?... o quizas Motomami??  te atreves con estas preguntas? Dale al Play! ';
    } else {
      botonEmpezar.style.backgroundImage = ' linear-gradient(180deg, #2af598 0%, #009efd 100%)';
      document.getElementById('wrapper').style.backgroundImage = ' linear-gradient(180deg, #2af598 0%, #009efd 100%)';
      texto.innerHTML = 'Te la vas a jugar a temas aleatorios? eres todo un intrepido!';
    }
    botonEmpezar.innerHTML = 'Juega ahora!';
    div.append(texto, botonEmpezar, botonVolver);
    document.getElementById('contenedorMain').appendChild(div);
    funcionabilidadBotonJugar(id_categoria);
    funcionabilidadBotonVolver();
  };

  const funcionabilidadBotonVolver = () => {
    document.getElementById('volverHome').addEventListener('click', () => location.reload());
  };

  const funcionabilidadBotonJugar = async (id_categoria) => {
    document.getElementById('botonJugar').addEventListener('click', async () => {
      document.getElementById('intermediarioSeleccionCategoria').style.display = 'none';
      let arrayPreguntas = await conseguirPreguntas(id_categoria);
      mostrarPreguntasYRespuestas(arrayPreguntas);
    });
  };

  const conseguirPreguntas = async (id) => {
    let url = `https://opentdb.com/api.php?amount=10&category=${id}`;

    try {
      let resolv = await fetch(url);
      let data = await resolv.json();
      data = data.results;
      return data;
    } catch (error) {
      console.log('Error : ' + error);
    }
  };

  const mostrarPreguntasYRespuestas = (preguntas) => {
    let pregunta = [];
    let respuestas = [];
    let respuestaCorrecta = [];
    preguntas.forEach((element) => {
      pregunta.push(element.question);
      respuestaCorrecta.push(element.correct_answer);
      respuestas.push(element.incorrect_answers);
    });

    logicaPreguntas(pregunta, respuestas, respuestaCorrecta);
  };

  const logicaPreguntas = (preguntas, respuestasI, respuestaC) => {
    let respuestas = respuestasI.map((element, index) => {
      element.push(respuestaC[index]);
      element.sort();
      return element;
    });
    mostrarTodoPorPantalla(preguntas, respuestas, respuestaC);
  };
  const mostrarTodoPorPantalla = (pregunta, respuesta, correcta, id = 0) => {
    if (document.getElementById('seccionPreguntas')) {
      const seccion = document.getElementById('seccionPreguntas');
      id++;
      seccion.remove();
      mostrarCard(pregunta, respuesta, correcta, id);
    } else {
      let contador = document.createElement('div');
      contador.id = 'contadorPreguntas';
      for (let i = 1; i <= 10; i++) {
        let p = document.createElement('p');
        p.className = 'numeroPreguntas';
        p.innerHTML = i;
        contador.appendChild(p);
      }
      document.getElementById('contenedorMain').append(contador);
      mostrarCard(pregunta, respuesta, correcta, id);
    }
  };

  const mostrarCard = (pregunta, respuesta, correcta, id) => {
    let numeroPregunta = document.querySelectorAll('.numeroPreguntas');

    if (id < 10) {
      numeroPregunta[id].style.boxShadow = '0px 0px 10px 0px black';
      let seccion = document.createElement('section');
      seccion.id = 'seccionPreguntas';
      let resp = document.createElement('p');
      resp.innerHTML = pregunta[id];
      let respS = document.createElement('div');
      respS.id = 'contenedorRespuestas';
      respS.append(resp);
      respuesta[id].forEach((element) => {
        let opcion = document.createElement('button');
        opcion.innerHTML = element;
        opcion.className = 'opcionRespuestas';
        opcion.value = element;
        respS.appendChild(opcion);
      });
      seccion.append(respS);
      document.getElementById('contenedorMain').append(seccion);
      activarBoton(pregunta, respuesta, correcta, id);
    } else {
      mostrarResultado();
    }
  };

  const activarBoton = (pregunta, respuesta, correcta, id) => {
    document.querySelectorAll('.opcionRespuestas').forEach((element) => {
      element.addEventListener('click', () => {
        if (correcta[id] === element.value) {
          element.style.boxShadow = '0px 0px 10px 0px green';
          setTimeout(() => {
            validarRespuesta(correcta[id], element.value, id);
            mostrarTodoPorPantalla(pregunta, respuesta, correcta, id);
          }, 1000);
        } else {
          element.style.boxShadow = '0px 0px 10px 0px red';
          setTimeout(() => {
            validarRespuesta(correcta[id], element.value, id);
            mostrarTodoPorPantalla(pregunta, respuesta, correcta, id);
          }, 1000);
        }
      });
    });
  };

  const validarRespuesta = (correcta, respuesta, id) => {
    let numeroPregunta = document.querySelectorAll('.numeroPreguntas');
    if (correcta === respuesta) {
      numeroPregunta[id].style.boxShadow = '0px 0px 10px 0px green';
      localStorage.Acertados++;
    } else {
      numeroPregunta[id].style.boxShadow = '0px 0px 10px 0px red';
    }
  };

  const mostrarResultado = () => {
    let div = document.createElement('div');
    div.id = 'contenedorResultado';
    let img = document.createElement('img');
    img.src = './img/home.gif';
    img.id = 'logoHome';
    let p = document.createElement('p');
    p.innerHTML =
      localStorage.Acertados > 5 ? `Has respondido ${localStorage.Acertados} bien, Felicidades!` : `Has respondido solo ${localStorage.Acertados} preguntas bien , tienes que esforzarte un poco mas!`;
    div.append(p, img);
    document.getElementById('contenedorMain').append(div);
    document.getElementById('logoHome').addEventListener('click', () => location.reload());
    guardarDatosLocalStorage();
  };

  const mostrarResultadosGrafica = () => {};
  // Guardamos las sesiones en el local storage tras terminar la tanda de preguntas
  const guardarDatosLocalStorage = () => {
    if (localStorage.SesionesAnterioresPreguntas) {
      let local = JSON.parse(localStorage.SesionesAnterioresPreguntas);
      let aciertos = localStorage.Acertados;
      let fecha = new Date().getTime();
      let guardar = {
        aciertos,
        fecha,
      };
      local.push(guardar);
      let objAguardar = JSON.stringify(local);
      localStorage.setItem('SesionesAnterioresPreguntas', objAguardar);
    } else {
      let aciertos = localStorage.Acertados;
      let fecha = new Date().getTime();
      let guardar = [
        {
          aciertos,
          fecha,
        },
      ];
      let objAguardar = [JSON.stringify(guardar)];
      localStorage.setItem('SesionesAnterioresPreguntas', objAguardar);
    }
  };
});
