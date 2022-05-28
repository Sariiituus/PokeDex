const typeColors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
};

const retrievePokemonListFromAPI = async () => {
  // lanzo peticion fetch
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  // transformamos a json la respuesta
  const jsonData = await response.json();
  // nos quedamos solo con los results
  return jsonData.results;
}



const retrieveDetailPokemonFromAPI = async (url) => {
  // lanzo peticion fetch
  const response = await fetch(url);
  // transformamos a json la respuesta
  const jsonData = await response.json();
  return jsonData;
}



const draw = async(pokemons) => {
  
  const catalogDiv = document.querySelector("#catalogContainer");
  while (catalogDiv.firstChild) {
    catalogDiv.removeChild(catalogDiv.lastChild);
  }

  for (const pokemon of pokemons) {
    // name y url
    let name = pokemon.name
    let url = pokemon.url

    const divFlipCard = document.createElement("div");
    divFlipCard.classList = "flip-card";

    const divFlipCardInner = document.createElement("div");
    divFlipCardInner.classList = "flip-card-inner";

    const divFlipCardFront = document.createElement("div");
    divFlipCardFront.classList = "flip-card-front";

    const h3 = document.createElement("h3");
    h3.innerText = name;
    h3.classList = "pokemon-title";
    divFlipCardFront.appendChild(h3);
    
    const pokemonDetail = await retrieveDetailPokemonFromAPI(url);
    const tipoPrincipal = pokemonDetail.types[0].type.name;
    const colorHexCard = typeColors[tipoPrincipal];
    divFlipCardInner.style.backgroundColor = colorHexCard;
    const urlPhoto = pokemonDetail.sprites.other.dream_world.front_default;

    const img = document.createElement("img");
    img.src = urlPhoto;
    img.classList = "pokemon-image";
    divFlipCardFront.appendChild(img);
    
    divFlipCardInner.appendChild(divFlipCardFront);

    const divFlipCardBack = document.createElement("div");
    divFlipCardBack.classList = "flip-card-back";

    const ulDatos = document.createElement("ul");
    const liID = document.createElement("li");
    const liBaseExperience = document.createElement("li");
    const liTipo = document.createElement("li");
    liID.innerText = `ID: ${pokemonDetail.id}`;
    liBaseExperience.innerText = `Experiencia base: ${pokemonDetail.base_experience}`;

    const typeNames = pokemonDetail.types.map(e => e.type.name);
    liTipo.innerText = `Tipo/s: ${typeNames.join(", ")}`;

    ulDatos.appendChild(liID);
    ulDatos.appendChild(liBaseExperience);
    ulDatos.appendChild(liTipo);

    divFlipCardBack.appendChild(ulDatos);

    divFlipCardInner.appendChild(divFlipCardBack);

    divFlipCard.appendChild(divFlipCardInner);

    catalogDiv.appendChild(divFlipCard);
  }

  document.querySelector("#btnSearch").removeAttribute("disabled");
}



const main = async() => {
  const btnSearch = document.querySelector("#btnSearch");
  btnSearch.setAttribute("disabled", true);

  const pokemons = await retrievePokemonListFromAPI();
  draw(pokemons);

  const searchElement = document.querySelector("#search");

  btnSearch.addEventListener("click", async function(ev) {
    btnSearch.setAttribute("disabled", true);
    const pokemons = await retrievePokemonListFromAPI();
    const filteredPokemons = pokemons.filter(
      elemento => elemento.name.includes(searchElement.value)
    );
    draw(filteredPokemons);
  });
}



main();
