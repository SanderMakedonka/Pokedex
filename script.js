let load = 21;
let searchPoke= [];
let currentLoad= 0;


async function init(){          
    loadPoke();
}

async function loadPoke(){
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0`;
    let response = await fetch(url);
    let respondPokemon = await response.json();
    let allPokemon = respondPokemon['results']
    globalThis.allPokemons= allPokemon;
    loadCart();
}

async function loadCart(){
    for (let i = currentLoad; i < load; i++) {
        currentLoad++;
        let thisPokemonUrl = allPokemons[i]['url'];
        let thisPokemon = await fetch(thisPokemonUrl);
        let currentPokemon = await thisPokemon.json();
        renderMiniCarts(currentPokemon);            
    }   
}

function loadMore(){
    load = load+20;
    loadCart();
}

function toggleBackBtn(){
    document.getElementById('btnPlus').classList.add('d-none');
    document.getElementById('btnMinus').classList.remove('d-none');
}

/* this part renders the mini Carts for the Landing Page  */

function renderMiniCarts(currentPokemon){       
       document.getElementById('pokemonNames').innerHTML+=/*html*/`
        <div class="pokemonMiniCard" id="pokemonMiniCard${currentPokemon['id']}" onclick="callSelection(${currentPokemon['id']})">
            <h3> ${currentPokemon['name']}</h3>
            <div class="pokeId" id="pokeId${currentPokemon['id']}"></div>
            <img src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}">
            <div class="types" id="type${currentPokemon['id']}">
        </div>
    `; 
    document.getElementById(`pokeId${currentPokemon['id']}`).innerHTML= `#${pokeIndexNr(currentPokemon['id'])}`;  
    
    addTypeBg(currentPokemon);    
}

async function enterFullscreen(currentPokemon,i){
    document.getElementById('fullscreen').classList.remove('d-none');
    document.getElementById('fullscreen').innerHTML = /*html*/`
     <div class="fullScreenContainer" id="fullScreenContainer" onclick="event.stopPropagation()">
        <img src="img/x-mark.png" class="closeTag" onclick="closeFullScreen()">
        <div class="fullscreenBg" id="fullscreenBg">            
            <h3> ${currentPokemon['name']}</h3>
           <div class="pokeIdFull" id="pokeIdFull${i}"></div> 
            <div class="typeBox" id="typeBox"></div>
        </div>
        <div class="fullscreenBgbottom"></div>
            <img class="pokePic" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}">
        </div> 
    `;
    document.getElementById(`pokeIdFull${currentPokemon['id']}`).innerHTML= `#${pokeIndexNr(currentPokemon['id'])}`;
    fullscreenBg(currentPokemon);
    renderCardMenu(i);
    document.getElementById('body').style = 'overflow: hidden;';
}


function pokeIndexNr(i){   
    let str = i.toString();
    while(str.length<4)str = "0"+str;
    return str;
}


function previous(i){
    callSelection(i-1);
}

function next(i){
    callSelection(i+1);
}

async function callSelection(i){
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let currentPokemon = await response.json();
    globalThis.currentPokemons = currentPokemon;

    enterFullscreen(currentPokemon,i);
}



function closeFullScreen(){
    document.getElementById('fullscreen').classList.add('d-none');
    document.getElementById('body').style='';
}

function renderCardMenu(i){
    document.getElementById('fullScreenContainer').innerHTML += /*html*/`
    <div class="cardMenu">
        <div><img class="objektFit" src="img/arrow-l.png" onclick="previous(${i})"></div>
        <div class="cardMenuText" id="menu1" onclick="contentAbout()">About</div>
        <div class="cardMenuText" id="menu2" onclick="contentBaseStats()">Base Stats</div>
        <div class="cardMenuText" id="menu3" onclick="contentMoves()">Moves</div>
        <div><img class="objektFit" src="img/arrow-r.png" onclick="next(${i})"></div>
    </div>
    <div class="cardMenuContend" id="cardMenuContend"></div>
    `;
    contentBaseStats();
}

function contentAbout(){
    setIsActiv(1);
    document.getElementById('cardMenuContend').innerHTML='';
    let height = currentPokemons['height']/10;
    let weight = currentPokemons['weight']/10;

    document.getElementById('cardMenuContend').innerHTML=/*html*/`
    <table id="aboutTable">
    <tr>
        <td>Height:</td><td>${height}m</td>
    </tr>
    <tr>
        <td>Weight:</td><td>${weight}kg</td>
    </tr>

    </table>
    `; 
    fillTableAbility();
    fillTableItems();
}

function fillTableAbility(){
    for (let i = 0; i < currentPokemons['abilities'].length; i++) {
        const ability = currentPokemons['abilities'][i]['ability']['name'];
        document.getElementById('aboutTable').innerHTML += /*html*/`
            <tr>
                <td>Ability ${i+1} : </td><td>${ability}</td>
            </tr>
        `;
    }
}
function fillTableItems(){
    for (let i = 0; i < currentPokemons['held_items'].length; i++) {
        const item = currentPokemons['held_items'][i]['item']['name'];
        document.getElementById('aboutTable').innerHTML += /*html*/`
            <tr>
                <td>Held Item ${i+1} : </td><td>${item}</td>
            </tr>
        `;
    }
}

function contentBaseStats(){
    setIsActiv(2);
    let pokemonStat = currentPokemons['stats'];
    document.getElementById('cardMenuContend').innerHTML='';
    for (let x = 0; x < pokemonStat.length; x++) {
       document.getElementById('cardMenuContend').innerHTML += /*html*/`
        <div class="statBar">
            <div id="statName">${currentPokemons['stats'][x]['stat']['name']}</div>
            <div class="progress" style="height: 15px;">
            <div class="progress-bar" role="progressbar" style="width: ${currentPokemons['stats'][x]['base_stat']-15}%;" aria-valuenow="" aria-valuemin="0" aria-valuemax="100">${currentPokemons['stats'][x]['base_stat']}</div>
            </div>
        </div> 
        `;
    }
}

function contentMoves(){
    setIsActiv(3);
    document.getElementById('cardMenuContend').innerHTML='';
    for (let i = 0; i < currentPokemons['moves'].length; i++) {
        const move = currentPokemons['moves'][i]['move']['name'];
        document.getElementById('cardMenuContend').innerHTML+=/*html*/`
            <div class="boxForType">${move}</div>
        `;
    }
}

function setIsActiv(isActiv){
    if(isActiv==1){
        document.getElementById('menu1').classList.add('isActiv');
        document.getElementById('menu2').classList.remove('isActiv');
        document.getElementById('menu3').classList.remove('isActiv'); 
    }else if(isActiv==2){
        document.getElementById('menu2').classList.add('isActiv');
        document.getElementById('menu1').classList.remove('isActiv');
        document.getElementById('menu3').classList.remove('isActiv'); 
    }else{
        document.getElementById('menu3').classList.add('isActiv');
        document.getElementById('menu1').classList.remove('isActiv');
        document.getElementById('menu2').classList.remove('isActiv'); 
    }
}


function getSearchInput() {
    let search = document.getElementById('searchInput').value;
    let searchValue = search.toLocaleLowerCase();
    document.getElementById('searchInput').value ='';
    filterPokemon(searchValue);
}

async function filterPokemon(searchValue) {
    for (let i = 0; i < allPokemons.length; i++) {
        const pokemon = allPokemons[i];
        let pokemonName = pokemon['name'];
        if (pokemonName.includes(searchValue)) {
            let pokemonResponse = await fetch(pokemon['url']);
            let pokemonAsJson = await pokemonResponse.json();
            searchPoke.push(pokemonAsJson);
        }
    }
    pokemonSearch();
}

function pokemonSearch() {
    let pokemonContainer = document.getElementById('pokemonNames');
    pokemonContainer.innerHTML = '';
    if (searchPoke.length == 0) {
        pokemonContainer.innerHTML = noPokemonFoundTemplate();
    } else {
        document.getElementById('pokemonNames').innerHTML ='';
        for (let i = 0; i < searchPoke.length; i++) {
            let currentPokemons= searchPoke[i];
            renderMiniCarts(currentPokemons,i); 
        }
        searchPoke=[];
        toggleBackBtn();
    }
}

function noPokemonFoundTemplate(){
    document.getElementById('pokemonNames').innerHTML ='';
    document.getElementById('pokemonNames').innerHTML =/*html*/`
        <h1>Don't exist</h1>
        <button class="btn btn-outline-info m-5">Back</button>
    `;
}