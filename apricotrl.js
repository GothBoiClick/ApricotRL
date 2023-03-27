//base canvas shit
const canvas = document.getElementById("apricotrl");
const ctx = canvas.getContext("2d");
//constants feed into grid calculations and canvas
const WIDTH = 40;
const HEIGHT = 24;
const SCENEWIDTH = WIDTH*16;
const SCENEHEIGHT = HEIGHT*16;
canvas.width = SCENEWIDTH;
canvas.height = SCENEHEIGHT;
//rendering function
//arrays needed for it first
let sceneItems = [];
let scenePlants = [];
let scenePlayer = [];
let sceneWalls = [];
//not sure were to put this yet, but since it's in array I'll just do with the others
let playerItems = [];
//crypto prices
let gncPrice = 50 + Math.random()*50;
let bitConnectPrice = 200 + Math.random()*100;
let bitCloutPrice = 100 + Math.random()*50;
let dakotaCoinPrice = 150 + Math.random()*100;
const updateCrypto = () => {
    gncPrice += (Math.random()*5) - 1;
    bitConnectPrice += (Math.random()*20) - 15;
    bitCloutPrice += (Math.random()*10) - 6;
    dakotaCoinPrice += (Math.random()*15) - 5;
    console.log(gncPrice);
    console.log(bitConnectPrice);
    console.log(bitCloutPrice);
    console.log(dakotaCoinPrice);
}
const render = () => {
    const drawSprites = array =>{
        for (let index = 0; index < array.length; index++) {
            const object = array[index];
            ctx.drawImage(object.sprite, object.x * 16, object.y * 16);
        
        }
    }
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, SCENEWIDTH, SCENEHEIGHT);
    //order here matters for what gets drawn on top of what etc
    drawSprites(scenePlants);
    drawSprites(sceneItems);
    drawSprites(scenePlayer);
    drawSprites(sceneWalls);
    
}
//sprite aliases
let spriteLoadCounter = 0;
let numberOfSprites = 0;
const createImage = (url, size) => {
    numberOfSprites += 1;
    let image = new Image(size, size);
    image.src = url;
    image.onload = () => {
        spriteLoadCounter += 1;
        if (spriteLoadCounter == numberOfSprites) {
            render();
        }
    }
    return image;
}
const ZACHFACE = createImage("/apricotrl/tiles/zach.png", 16);
const WALL = createImage("/apricotrl/tiles/shittywall.png", 16);
const UNRIPEAPRICOT = createImage("/apricotrl/tiles/apricot_1.png", 16);
const RIPEAPRICOT = createImage("/apricotrl/tiles/apricot_2.png", 16);
const ROTTENAPRICOT = createImage("/apricotrl/tiles/apricot_3.png", 16);
const TOMBSTONE = createImage("/apricotrl/tiles/tombstone.png", 16);
const APRICOTPLANTBARE = createImage("/apricotrl/tiles/apricottree1.png", 16); //TODO: need to make actual sprite for this
const APRICOTPLANTUNRIPE = createImage("/apricotrl/tiles/apricottree1.png", 16);
const APRICOTPLANTRIPE = createImage("/apricotrl/tiles/apricottree2.png", 16);
const APRICOTPLANTROTTEN = createImage("/apricotrl/tiles/apricottree3.png", 16);
//initializing variables
let cooldown = 0;
let currentTime = 0;
//timer here since controls pretty much "controls" it
const timer = advance => {
    if (advance) {
        currentTime += 1;
        if(currentTime % 10 == 0) {
            growPlants();
        }
        if(currentTime % 100 == 0) {
            updateCrypto();
        }
        zach.hunger -= 1;
        if(zach.hunger < 1) {
            killZach();
        }
        render();
    }
}
//controls
let keys = []; //keeps track of currently pressed keys
const controls = () => {
    const left = zach.x-1;
    const right = zach.x+1;
    const up = zach.y-1;
    const down = zach.y+1;
    const currentX = zach.x;
    const currentY = zach.y;
    incrementTimer = false;
    if (zach.alive) {
        if (keys["l"]||keys[6]){
            moveZach(right, currentY);
        }
        if (keys["h"]||keys[4]){
            moveZach(left, currentY);
        }
        if (keys["k"]||keys[8]) {
            moveZach(currentX, up);
        }
        if (keys["j"]||keys[2]) {
            moveZach(currentX, down);
            }
        if (keys["y"]||keys[7]) {
            moveZach(left, up);
        }
        if (keys["u"]||keys[9]) {
            moveZach(right, up);
        }
        if (keys["b"]||keys[1]) {
            moveZach(left, down);
        }
        if (keys["n"]||keys[3]) {
            moveZach(right, down);
        }
        if (keys[" "]) {
            useFloorObject();
        }
        if (keys["p"]) {
            pickApricot();
        }
        if (keys["g"]) {
            getFloorItem();
        }
        if (keys["d"]) {
            dropItem(apricot);
        }
        if (keys["e"]) {
            eatHeldApricot();
        }
    }
    timer(incrementTimer);
}

function collisionCheck(x, y) {
    for (let index = 0; index < sceneWalls.length; index++) {
        let object = sceneWalls[index];
        if(object.x == x && object.y == y) {
            return true;
        }
    }
    return false; //needed?
}
function moveZach(newX, newY) {
    if (!collisionCheck(newX, newY)) {
        zach.x = newX
        zach.y = newY
        incrementTimer=true
    }
}
function growPlants() {
    for (let index = 0; index < scenePlants.length; index++) {
        const plant = scenePlants[index];
        if (plant.ripeness < 0 && 0.1 > Math.random()) {
            plant.sprite == APRICOTPLANTUNRIPE;
            plant.ripeness += 1;
        }
        if (plant.ripeness == 0 && 0.05 > Math.random()) {
            plant.sprite = APRICOTPLANTRIPE;
            plant.ripeness += 1;
        }
        if (plant.ripeness == 1 && 0.01 > Math.random()) {
            plant.sprite = APRICOTPLANTROTTEN;
            plant.ripeness += 1;
        }
        
    }
}
function killZach() {
    zach.sprite=TOMBSTONE;
    zach.alive=0;
}
//player input
function useFloorObject() {
    for (let index = 0; index < scenePlants.length; index++) {
        const plant = scenePlants[index];
        //would break if it was weed instead of apricot, seperate check within loop for which one it is
        if (plant.x == zach.x && plant.y == zach.y && plant.ripeness > 0) {
            if (plant.ripeness == 1) {
                zach.hunger += 11;
            } // needs to be before ripeness change to work i think
            resetPlant();
            incrementTimer=true;
        }
        
    }
}
function getFloorItem() {
    for (let index = 0; index < sceneItems.length; index++) {
        const floorItem = sceneItems[index];
        if (floorItem.x == zach.x && floorItem.y == zach.y) {

        }
    }
}

//we'll look at this again later, not super happy with how it works
//lazily having this as seperate function, to make it part of picking up floor items just have it check plant array for a tree at current location with case statement or some shit
const pickApricot = () => {
    for (let index = 0; index < scenePlants.length; index++) {
        const plant = scenePlants[index];
        if (plant.x == zach.x && plant.y == zach.y && plant.ripeness == 1) {
            resetPlant();
            for (let index = 0; index < playerItems.length; index++) {
                const item = playerItems[index];
                if (item.name = 'apricot') {
                    item.quantity += 1
                    return;
                }
            }
            playerItems.push({...apricot});
        }
    }
}

function eatHeldApricot() {

}
function dropItem(item) {
    for (let index = 0; index < playerItems.length; index++) {
        const playerItem = playerItems[index];
        if (playerItem.name == item.name) {
            let droppedItem = {...playerItems[index]};
            droppedItem.x = zach.x;
            droppedItem.y = zach.y;
            droppedItem.quantity = 1;
            sceneItems.push(droppedItem);
            playerItems[index].quantity -= 1;
            if (playerItem.quantity < 1) {
                playerItems.splice(index, 1);
            }
        }
        
    }
}
function resetPlant() {
    for (let index = 0; index < scenePlants.length; index++) {
        const plant = scenePlants[index];
        if (plant.x == zach.x && plant.y == zach.y) {
            plant.sprite = APRICOTPLANTBARE;
            plant.ripeness = -1;
        }
        
    }
}
document.body.onkeydown = function(e){
    keys[e.key]=true;
    clearTimeout(cooldown);
    cooldown = setTimeout(() => {
        controls();
    }, 33);
}
document.body.onkeyup = function(e){
    keys[e.key]=false;
}
//constructors
//TODO: generic constructor that creates objects globally
// Sebs says it gets pushed to array and can scan through array for object info
//but is that what i want?
function wallConstructor(x, y) {
    let wall = {
        name : 'wall',
        sprite: WALL,
        x : x,
        y : y,
    }
    sceneWalls.push(wall);
}
function apricotOrchard(x, y) {
    let apricotTree = {
        name : 'apricotTree',
        sprite: APRICOTPLANTBARE,
        ripeness : -1,
        x : x,
        y : y,
    }
    scenePlants.push(apricotTree);
}
//STATIC IMMUTABLE OBJECTS DECLARED WITH BOILERPLATE FUCKING EWWW BRO
//I BET YOU PLAY HOGWARTS LEGACY TOO
let zach = {
    name : 'zach',
    sprite : ZACHFACE,
    apricotStash : 0,
    hunger : 100,
    alive : true,
    x : WIDTH/2,
    y : 1,
}
//will eventually add support for picking up underipe and rotten apricots too
let apricot = {
    name : 'apricot',
    sprite : RIPEAPRICOT,
    type : 'food',
    nourishment : 10,
    quantity : 1,
}
/* MAIN CONSTRUCTION
drawing map, spawning Zach, also other objects i need to implement */

//constructs walls, right now just a border around edges
function borderWall() {
    for (let index = 0; index < WIDTH; index++) {
        wallConstructor(index, 0);
        wallConstructor(index, HEIGHT-1);
    }
    for (let index = 0; index < HEIGHT; index++) {
        wallConstructor(0, index);
        wallConstructor(WIDTH-1, index);
    }
}
function lushApricotFields() {
    for (let x = WIDTH/4; x < (WIDTH/2); x++) {
        for(let y = 2; y < HEIGHT-2; y++) {
            apricotOrchard(x*2-1, y)
        }
    }
}
borderWall();
lushApricotFields();
scenePlayer.push(zach);
//hey check out my sex toys youtube bros10function ingYourMo600600600)
