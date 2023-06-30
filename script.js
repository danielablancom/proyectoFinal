const carrito = JSON.parse(localStorage.getItem('carro')) || [];
let itemsEnCarrito = document.getElementById('carrito-items');
let contenedorItems = document.getElementById('items');
let filtro = document.getElementById('filtro');
let borrarBusqueda = document.getElementById('borrarBusqueda');
let min = document.getElementById('min');
let max = document.getElementById('max');
let formulario = document.getElementById('text');
let resultado = document.getElementById('resultado');
let contenedorBalance = document.getElementById('balance');
let calcularPresupuesto = document.getElementById('calcular');
let travelCal = document.getElementById('travelCal');

function getValues() {
  let presupuesto = document.getElementById('viaje').value;
  let hospedaje = document.getElementById('hospedaje').value;

  let transporte = document.getElementById('transporte').value;
  let comida = document.getElementById('comida').value;

  return { presupuesto, hospedaje, transporte, comida };
}

function obtenerMontos(e) {
  e.preventDefault();

  const { presupuesto, hospedaje, transporte, comida } = getValues();
  let gastos = parseInt(hospedaje) + parseInt(transporte) + parseInt(comida);
  let balance = parseInt(presupuesto - gastos);
  renderizarGastos(hospedaje, transporte, comida, presupuesto, balance);
}

function renderizarGastos(hospedaje, transporte, comida, balance) {
  let dataPrint = document.createElement('div');
  dataPrint.innerHTML = `
  <div class="card col-sm-3 p-2">
      <div class="card-body">
          <p class="card-text">$ ${hospedaje}</p>
          <p class="card-text">$ ${transporte}</p>
          <p class="card-text">$ ${comida}</p>
          <p class="card-text">$ ${balance}</p>
      </div>
  </div>
`;

  contenedorBalance.appendChild(dataPrint);
  reset();
}

function reset() {
  document.getElementsById('travelCalc').reset();
}

// travelCal.addEventListener('click', obtenerMontos);

//DOM
function renderizarProductos(listaItems) {
  contenedorItems.innerHTML = '';
  for (const item of listaItems) {
    contenedorItems.innerHTML += `
            <div class="card col-sm-3 p-2">
                <img class="card-img-top" src=${item.foto} alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${item.nombre}</h5>
                    <p class="card-text">$ ${item.precio}</p>
                    <button id=${item.id} class="btn btn-primary compra">Comprar</button>
                </div>
            </div>
        `;
  }

  let botones = document.getElementsByClassName('compra');
  for (const boton of botones) {
    boton.addEventListener('click', () => {
      const prodACarro = paquetes.find((producto) => producto.id == boton.id);
      console.log(prodACarro);
      agregarACarrito(prodACarro);
    });

    boton.onmouseover = () => {
      boton.classList.replace('btn-primary', 'btn-success');
    };
    boton.onmouseout = () => {
      boton.classList.replace('btn-success', 'btn-primary');
    };
  }
}

renderizarProductos(paquetes);

function agregarACarrito(producto) {
  carrito.push(producto);
  console.table(carrito);
  itemsEnCarrito.innerHTML += `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
        </tr>
    `;

  let total = carrito.reduce((ac, prod) => ac + prod.precio, 0);
  console.log(total);
  document.getElementById('total').innerText = `Total a pagar $:${total}`;

  localStorage.setItem('carro', JSON.stringify(carrito));
}

function filtrarPorPais() {
  resultado.innerHTML = '';
  const texto = formulario.value.toLowerCase();
  for (let paquete of paquetes) {
    let nombrePais = paquete.pais.toLowerCase();
    if (nombrePais.indexOf(texto) !== -1) {
      resultado.innerHTML += `<div class="card col-sm-3 p-2">

<li>${paquete.pais}</li> 
<h2>Planifiquemos tu viaje a ${paquete.pais}</h2>
</div>

`;
    }
  }
  if (resultado.innerHTML == '') {
    resultado.innerHTML += `<li>Resultado no encontrado</li> `;
  }
}

filtro.addEventListener('click', filtrarPorPais);
formulario.addEventListener('keyup', filtrarPorPais);

function filtrarPorPrecio(precioMin, precioMax) {
  const filtrados = productos.filter(
    (prod) => prod.precio >= precioMin && prod.precio <= precioMax
  );
  sessionStorage.setItem('filtrados', JSON.stringify(filtrados));
  return filtrados;
}

filtro.onclick = () => {
  console.log('click');
  console.log(min.value, max.value);
  if (min.value != '' && max.value != '' && min.value < max.value) {
    let listaFiltrados = filtrarPorPrecio(min.value, max.value);
    console.log(listaFiltrados);
    renderizarProductos(listaFiltrados);
  }
};
