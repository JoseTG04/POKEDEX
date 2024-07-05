const MAX_POKEMON = 200;
const listaPokemon = document.querySelector("#listaPokemon");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const typeFilter = document.querySelector("#type");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

// Fetch inicial para obtener la lista de Pokémon
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
  });

async function fetchAntesDeRedireccionar(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error(
      "Error al recuperar los datos de Pokemon antes de la redirección"
    );
  }
}

function displayPokemons(pokemonList) {
  listaPokemon.innerHTML = "";

  pokemonList.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`)
      .then((response) => response.json())
      .then((data) => {
        const listItem = document.createElement("div");
        listItem.className = "pokemon";
        listItem.setAttribute(
          "data-types",
          data.types.map((type) => type.type.name).join(" ")
        );
        pokemon.types = data.types.map((type) => type.type.name); //filtro tipos

        let tipos = data.types
          .map(
            (type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`
          )
          .join("");

        listItem.innerHTML = `
          <p class="pokemon-id-back">#${pokemonID}</p>
          <div class="pokemon-imagen-container">
            <div class="pokemon-imagen pokemon-front" id="pokemon-imagen-id">
              <img class="imagen" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonID}.png" alt="${pokemon.name}" />
            </div>
            <div class="pokemon-imagen pokemon-back" id="pokemon-imagen-id">
              <img class= "imagen" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png" alt="${pokemon.name}" />
            </div>
          </div>
          <div class="pokemon-info">
              <div class="nombre-contenedor">
                  <p class="pokemon-id">#${pokemonID}</p>
                  <h2 class="pokemon-nombre">${pokemon.name}</h2>
              </div>
              <div class="pokemon-tipos">
                  ${tipos}
              </div>
          </div>
        `;

        listItem.addEventListener("click", async () => {
          const success = await fetchAntesDeRedireccionar(pokemonID);
          if (success) {
            window.location.href = `./detail.html?id=${pokemonID}`;
          }
        });

        listaPokemon.appendChild(listItem);
      });
  });
}

searchInput.addEventListener("keyup", handleSearch);



function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else if (typeFilter.checked) { // Filtrar por tipo 
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.types.some((type) => type.startsWith(searchTerm))
    );
  } 
    displayPokemons(filteredPokemons);


  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}
