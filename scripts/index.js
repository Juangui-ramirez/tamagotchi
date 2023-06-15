let url = "https://pokeapi.co/api/v2/pokemon";

const getPokemon = async () => {
  try {
    const res = await fetch(`${url}?offset=0&limit=9`);
    const data = await res.json();

    const choosePoke = prompt(
      "Choose your Poke: 1) Bulbasaur, 2) Charmander, 3) Squirtle"
    );

    let pokemonIndex;

    switch (choosePoke) {
      case "1":
        pokemonIndex = 0;
        break;
      case "2":
        pokemonIndex = 3;
        break;
      case "3":
        pokemonIndex = 6;
        break;
      default:
        alert("Option Invalid");
        return;
    }

    await showPokemon(
      data.results[pokemonIndex],
      data.results[pokemonIndex + 1],
      data.results[pokemonIndex + 2]
    );
  } catch (error) {
    alert("URL ERROR");
  }
};

const showPokemon = async (pokemon, evo1, evo2) => {
  const pokemonRes = await fetch(pokemon.url);
  const pokemonData = await pokemonRes.json();
  const evo1Res = await fetch(evo1.url);
  const evo1Data = await evo1Res.json();
  const evo2Res = await fetch(evo2.url);
  const evo2Data = await evo2Res.json();

  const showEnergy = document.querySelector(".energyProgress");
  let energy = 100;
  updateEnergy();

  const pokeimg = document.querySelector(".poke");
  const pokeName = document.querySelector(".namePoke");
  const sleepImg = document.querySelector(".sleepImg");

  sleepImg.src = "assets/sleeping.gif";

  pokeimg.src =
    pokemonData.sprites.versions["generation-v"][
      "black-white"
    ].animated.front_shiny;

  pokeName.textContent = pokemonData.name;
  let expBase = pokemonData.base_experience;

  const btnWorkout = document.querySelector(".workout");
  let hasEvo1 = false;
  let hasEvo2 = false;
  let expReq = evo1Data.base_experience;

  btnWorkout.addEventListener("click", async function () {
    if (energy <= 10 || isSleeping == true) {
      alert(`${pokeName.textContent} needs to sleep`);
      return;
    }

    expBase = expBase + 15;
    energy = energy - 10;
    updateEnergy();

    if (expBase >= expReq && !hasEvo1) {
        hasEvo1 = true;
        alert("Your Pokemon is evolving");
      pokeimg.src =
        evo1Data.sprites.versions["generation-v"][
          "black-white"
        ].animated.front_shiny;
      pokeName.textContent = evo1Data.name;

      expReq = evo2Data.base_experience;
    }

    if (expBase >= expReq && !hasEvo2) {
        hasEvo2 = true;
        alert("Your Pokemon is evolving again");
        pokeimg.src =
          evo2Data.sprites.versions["generation-v"][
            "black-white"
          ].animated.front_shiny;
        pokeName.textContent = evo2Data.name;
      }
  });

  const btnSleep = document.querySelector(".sleep");
  const body = document.querySelector("body");
  let isSleeping = false;
  let energyInterval;

  btnSleep.addEventListener("click", function () {
    if (isSleeping) {
      alert(`${pokeName.textContent} is already sleeping`);
      return;
    }

    pokeimg.classList.add("hidden");
    sleepImg.classList.add("show");
    body.classList.add("sleep");

    isSleeping = true;
    energy = energy;
    updateEnergy();

    energyInterval = setInterval(function () {
      energy += 7;
      updateEnergy();

      if (energy >= 100) {
        clearInterval(energyInterval);
        isSleeping = false;
        alert(`${pokeName.textContent} woke up!`);
        pokeimg.classList.remove("hidden");
        sleepImg.classList.remove("show");
        body.classList.remove("sleep");
      }
    }, 1000);
  });

  function updateEnergy() {
    showEnergy.style.width = `${energy}%`;

    if (energy <= 20) {
      showEnergy.style.backgroundColor = "#ff0000";
    } else if (energy <= 50) {
      showEnergy.style.backgroundColor = "#ffa500";
    } else {
      showEnergy.style.backgroundColor = "#4caf50";
    }
  }
};

getPokemon();
