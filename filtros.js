// CONTROL RESTRICCIÓN DE EDAD PARA LAS PELÍCULAS

function calcularEdadUsuario() {
  const fechaNacStr = localStorage.getItem("userBirthdate"); // Obtiene la fecha de nacimiento del usuario
  if (!fechaNacStr) return 0; // Verifica si no hay fecha guardada o si el valor está vacío. Si no existe una fecha, se considera que la edad es cero
  
  const hoy = new Date(); // Convierte la fecha de nacimmiento guardada en un objeto de fecha par aque JS pueda utilizar
  const nac = new Date(fechaNacStr); // Calcula la edad aprox (ya que no considera meses ni días, solo el año)
  let edad = hoy.getFullYear() - nac.getFullYear(); //Calcula la diferencia entre el mes actual y el de nacimiento 
  const mes = hoy.getMonth() - nac.getMonth(); // Al igual que en la otra parte, verifica si es que el cumpleaños del usuario aún no es durante el año
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
    edad--; // Lo mismo; si la persona cumple años en diciembre de 2026 y estamos en octubre de 2026. se le resta 1 a la edad, ya que aún no cumple años
  }
  return edad;
}

function esUsuarioAutorizadoParaPelicula() { // Función que determina si el usuario cumple con la edad mínima requerida por película
  const contenedorFiltro = document.getElementById("filtro-edad-contenedor"); // Busca el elemento que contiene la información de restricción de edad
  if (!contenedorFiltro) return true; // Si no hay filtro, se considera autorizado para ver las reseñas de la película

  const edadMinima = parseInt(contenedorFiltro.getAttribute("data-edad") || "0", 10); // Obtiene la edad mínima definida (en la parte de <div id = "filtro-edad-contenedor" data-edad = 18)
  const edadUsuario = calcularEdadUsuario(); // Obtiene la edad del usuario

  return edadUsuario >= edadMinima; // Por ejemplo, si la edad mínima de tal película es 18, el resultado será true solo si la edad del usuario es mayor o igual. Si es que no se registra la fecha de nacimiento, de igual forma el resultado será false
}
function aplicarFiltroEdad() {
  const contenedorFiltro = document.getElementById("filtro-edad-contenedor"); // Busca el contenedor del filtro
  if (!contenedorFiltro) return; // Si no existe termina la función 

  const estaAutorizado = esUsuarioAutorizadoParaPelicula(); // Comprueba si el usuario cumple con la edad mínima

  const listaResenas = document.getElementById("listaResenas"); // Obtiene la sección de donde aparecen las reseñas
  const overlayOjo = document.getElementById("overlayOjo"); // Obtiene el aviso encima de las reseñas que se aplica cuando están bloqueadas

  if (!estaAutorizado) {
    // Si es menor de edad...
    if (listaResenas) listaResenas.classList.add("reseñas-bloqueadas"); // Agrega el desenfoque de las reseñas
    if (overlayOjo) overlayOjo.classList.remove("oculto"); // Mustra el aviso con el ojo
  } else {
    // Si cumple la edad...
    if (listaResenas) listaResenas.classList.remove("reseñas-bloqueadas"); // Quita el desenfoque de las reseñas
    if (overlayOjo) overlayOjo.classList.add("oculto"); // Esconde el aviso con el ojo
  }
}
document.addEventListener("DOMContentLoaded", aplicarFiltroEdad); // Hace que el filtro se aplique automáticamente al abrir la página de la película

// Quita el bloqueo de reseñas cuando se presione el botón respectivo
function desbloquearReseñas() {
  const listaResenas = document.getElementById("listaResenas"); // Busca la lista de reseñas
  const overlayOjo = document.getElementById("overlayOjo"); // Busca el aviso 

  if (listaResenas) listaResenas.classList.remove("reseñas-bloqueadas"); // Quita el desenfoque de las reseñas
  if (overlayOjo) overlayOjo.classList.add("oculto"); // Esconde el aviso con el ojo
}

function filtrarCatalogo() {
  const texto = inputBusqueda.value.toLowerCase().trim();
  const genero = selectGenero.value.toLowerCase();
  let totalVisibles = 0;

  const bloquesGenero = document.querySelectorAll(".bloque-genero");

  bloquesGenero.forEach(bloque => {
    const tarjetas = bloque.querySelectorAll(".tarjeta-pelicula");
    let visiblesEnBloque = 0;

    tarjetas.forEach(tarjeta => {
      const titulo = tarjeta.getAttribute("data-titulo") ? tarjeta.getAttribute("data-titulo").toLowerCase() : "";
      const generos = tarjeta.getAttribute("data-genero") ? tarjeta.getAttribute("data-genero").toLowerCase() : "";

      const coincideTexto = titulo.includes(texto);
      const coincideGenero = genero === "todos" || generos.includes(genero);

      if (coincideTexto && coincideGenero) {
        tarjeta.classList.remove("oculto");
        visiblesEnBloque++;
        totalVisibles++;
      } else {
        tarjeta.classList.add("oculto");
      }
    });

    // Si no hay películas visibles en la categoría, oculta la sección entera
    if (visiblesEnBloque === 0) {
      bloque.classList.add("oculto");
    } else {
      bloque.classList.remove("oculto");
    }
  });

  mensajeVacio.hidden = totalVisibles > 0;
}