const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const spriteContainer = document.getElementById("sprite-container");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const types = document.getElementById("types");
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const specialAttack = document.getElementById("special-attack");
const specialDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");

const fetchData = async () =>{
  try{
    const searchInput = input.value.toLowerCase();
    const res = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${searchInput}`);
    const data = await res.json();
    showInfo(data);
  }catch (err){
    alert("Pokémon not found");
    resetStats();
    console.log(err);
  }
}


const showInfo = (data) => {
  pokemonId.innerText = `  # ${data.id}`;
  pokemonName.innerText = `${data.name} `;
  weight.textContent = `Weight: ${data.weight}`;
  height.textContent = `Height: ${data.height}`;
  spriteContainer.innerHTML = `<img id= "sprite" src=${data.sprites.front_default}>`;

  hp.textContent = data.stats[0].base_stat;
  attack.textContent = data.stats[1].base_stat;
  defense.textContent = data.stats[2].base_stat;
  specialAttack.textContent = data.stats[3].base_stat;
  specialDefense.textContent = data.stats[4].base_stat;
  speed.textContent = data.stats[5].base_stat;

  types.innerHTML = data.types.map((obj)=> `<span class="${obj.type.name}">${obj.type.name}</span>`).join(' ');
}

const resetStats = () => {
    const sprite = document.getElementById("sprite");
    if (sprite) sprite.remove();
    
    pokemonName.textContent = '';
    pokemonId.textContent = '';
    types.innerHTML = '';
    height.textContent = '';
    weight.textContent = '';
    hp.textContent = '';
    attack.textContent = '';
    defense.textContent = '';
    specialAttack.textContent = '';
    specialDefense.textContent = '';
    speed.textContent = '';
}


const searchPokemon = (name) => {
    fetchData(name);
}

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchPokemon();
  });