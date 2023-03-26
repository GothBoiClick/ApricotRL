//used for canvas AND calculations
const WIDTH = 40;
const HEIGHT = 24;
const SCENEWIDTH = WIDTH*16;
const SCENEHEIGHT = HEIGHT*16;
//usual canvas shit
const canvas = document.getElementById("apricotrl");
canvas.width = SCENEWIDTH;
canvas.height = SCENEHEIGHT;
const ctx = canvas.getContext("2d");
//sprite aliases
const ZACHFACE = createImage("/apricotrl/tiles/Characters/zach.png", 16);
const WALL = createImage("/apricotrl/tiles/Objects/shittywall.png", 16);
const UNRIPEAPRICOT = createImage("/apricotrl/tiles/Objects/apricot_1.png", 16)
const RIPEAPRICOT = createImage("/apricotrl/tiles/Objects/apricot_2.png", 16)
const ROTTENAPRICOT = createImage("/apricotrl/tiles/Objects/apricot_3.png", 16)
const TOMBSTONE = createImage("/apricotrl/tiles/Objects/tombstone.png", 16)
const APRICOTPLANTBARE = createImage("/apricotrl/tiles/Objects/apricottree1.png", 16) //TODO: need to make actual sprite for this
const APRICOTPLANTUNRIPE = createImage("/apricotrl/tiles/Objects/apricottree1.png", 16)
const APRICOTPLANTRIPE = createImage("/apricotrl/tiles/Objects/apricottree2.png", 16)
const APRICOTPLANTROTTEN = createImage("/apricotrl/tiles/Objects/apricottree3.png", 16)
//initializing variables
let cooldown;
let currentTime = 0;
//arrays
let keys = []; //keeps track of currently pressed keys
let sceneItems = [];
let scenePlants = [];
let scenePlayer = [];
let sceneWalls = []; 
function createImage(url, size) {
    let image = new Image(size, size);
    image.src = url;
    return image;
}
function drawOnGrid(obj) {
    ctx.drawImage(obj.sprite, obj.x * 16, obj.y * 16);
}
function drawBG(){
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, SCENEWIDTH, SCENEHEIGHT);
}
function drawSprites(array){
    for (let index = 0; index < array.length; index++) {
        const object = array[index];
        drawOnGrid(object);
        
    }
}
function render(){
    drawBG();
    //order here matters for what gets drawn on top of what etc
    drawSprites(scenePlants);
    drawSprites(scenePlayer);
    drawSprites(sceneWalls);
    
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
function timer(advance) {
    if (advance) {
        currentTime += 1;
        if(currentTime % 10 == 0) {
            growPlants();
        }
        zach.hunger -= 1;
        if(zach.hunger < 1) {
            killZach();
        }
        render();
    }
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
            plant.sprite = APRICOTPLANTBARE;
            plant.ripeness = -1;
            incrementTimer=true;
        }
        
    }
}
function getFloorObject() {
    for (let index = 0; index < scenePlants.length; index++) {
        const item = scenePlants[index];
        if (item.x == zach.x && item.y == zach.y && item.ripeness == 1) {
            zach.apricotStash += 1;
            item.sprite = APRICOTPLANTBARE;
            item.ripeness = -1;
            incrementTimer=true;
        }
        
    }
}
function eatHeldApricot() {
    if (zach.apricotStash > 0 && zach.alive) {
        zach.apricotStash -= 1;
        zach.hunger += 11;
        incrementTimer=true;
    }
}
function dropApricot() {

}
function resetPlant() {
    for (let index = 0; index < scenePlants.length; index++) {
        const plant = scenePlants[index];
        if (plant.x == zach.x && plant.y == zach.y) {

        }
        
    }
}
function controls() {
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
        if (keys["g"]) {
            getFloorObject();
        }
        if (keys["e"]) {
            eatHeldApricot();
        }
        if (keys["d"]) {
            dropApricot();
        }
    }
    timer(incrementTimer);
    /*
    switch(moveString){
        case "0":

        break;
        case "01":

        break;
    }
    */
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
        sprite: WALL,
        x : x,
        y : y,
    }
    sceneWalls.push(wall);
}
function apricotOrchard(x, y) {
    let apricotTree = {
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
    sprite : ZACHFACE,
    apricotStash : 0,
    hunger : 100,
    alive : true,
    x : WIDTH/2,
    y : 1,
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
//for some reason this render call doesn't properly load sprites if they aren't cached
//is it running too fast for all the images to finish constructing or something?
render();
