
function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function () {
  /*
   * 1 = Americano 1.15
   * 2 = Asiatico 1.05
   * 3 = Europeo 1.35
   */

  let cantidad;
  const base = 2000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
    default:
      break;
  }

  const diferencia = new Date().getFullYear() - this.year;

  //cada año que la diferencia es mayor, el costo reducira un 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
   * si el seguro es basico se suma un 30%
   * si el seguro es completo se suma un 50%
   */

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad;
};

function UI() {}

UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear(),
    min = max - 20;
  const selectYear = document.querySelector("#year");
  for (let i = max; i > min; i--) {
    let option = document.createElement("OPTION");
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
};

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement("DIV");
  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }
  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  const formulario = document.querySelector("#cotizar-seguro");
  formulario.insertBefore(div, document.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 2000);
};

UI.prototype.mostrarResultado = (seguro, total) => {
  const { marca, year, tipo } = seguro;

  let textoMarca;
  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiatico";
      break;
    case "3":
      textoMarca = "Europeo";
      break;
    default:
      break;
  }

  const div = document.createElement("DIV");
  div.classList.add("mt-10");
  div.innerHTML = `
  <p class='header'>Tu Resumen</p>
  <p class='font-bold'>Automóvil: <span class='font-normal'>${textoMarca}</span></p>
  <p class='font-bold'>Año: <span class='font-normal'>${year}</span></p>
  <p class='font-bold'>Tipo de cobertura: <span class='font-normal capitalize'>${tipo}</span></p>
  <p class='font-bold'>Tu seguro tiene un valor de: $${total}</p>
  `;
  const resultadoDiv = document.querySelector("#resultado");

  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";
  setTimeout(() => {
    spinner.style.display = "none";
    resultadoDiv.appendChild(div);
  }, 2000);
};

const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones();
});

evenListeners();
function evenListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();
  const marca = document.querySelector("#marca").value;
  const year = document.querySelector("#year").value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }
  ui.mostrarMensaje("Cotizando...", "correcto");

  const resultados = document.querySelector("#resultado div");
  if (resultados != null) {
    resultados.remove();
  }
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();
  ui.mostrarResultado(seguro, total);
}
