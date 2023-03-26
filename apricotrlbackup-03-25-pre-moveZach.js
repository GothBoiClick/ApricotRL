//used for canvas AND calculations
let width = 80;
let height = 24;
let sceneWidth = width*16;
let sceneHeight = height*16;
//usual canvas shit
const canvas = document.getElementById("apricotrl");
canvas.width = sceneWidth;
canvas.height = sceneHeight;
const ctx = canvas.getContext("2d");
//constants
const zachsCuteFace = "/apricotrl/tiles/Characters/zach.png";
const zachsCuteWall = "/apricotrl/tiles/Objects/shittywall.png";
const unripeApricot = "/apricotrl/tiles/Objects/apricot_1.png"
const ripeApricot = "/apricotrl/tiles/Objects/apricot_2.png"
const rottenApricot = "/apricotrl/tiles/Objects/apricot_3.png"
const tombstone = "/apricotrl/tiles/Objects/tombstone.png"
//initializing variables
let cooldown;
let currentTime = 0;
//arrays
let keys = []; //keeps track of currently pressed keys
let sceneObjects = []; //all objects in scene
//semiprim functions
function createImage(url, size) {
    let image = new Image(size, size);
    image.src = url;
    return image;
}
function drawOnGrid(obj) {
    ctx.drawImage(obj.sprite, obj.x * 16, obj.y * 16);
}
function render(){
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, sceneWidth, sceneHeight);
    for (let index = 0; index < sceneObjects.length; index++) {
        let object = sceneObjects[index];
        drawOnGrid(object);
    }
    //control();
    requestAnimationFrame(render);
}
function collisionCheck(x, y) {
    for (let index = 0; index < sceneObjects.length; index++) {
        let object = sceneObjects[index];
        if(object.x == x && object.y == y && object.class == 'wall') {
            return true;
        }
    }
    return false;
}
function moveZach(newX, newY) {
    if (!collisionCheck(newX, newY)) {
        zach.x = newX
        zach.y = newY
        incrementTimer=true
    }
}
function ripenApricots() {
    for (let index = 0; index < sceneObjects.length; index++) {
        const element = sceneObjects[index];
        //could simplify by checking ripeness instead of class and only have ripeness be a property of the apricots but that's maybe confusing?
        //fuck it ill do it
        //if this breaks it's because ripeness doesnt exist for all scene objects but class does
        if (element.ripeness == 0 && 0.05 > Math.random()) {
            //naive, updates sprite directly
            //id like to have it so it can just directly increment a ripeness and that directly references itself to update sprite AND pickability
            element.sprite = createImage(ripeApricot, 16);
            element.ripeness += 1;
        }
        if (element.ripeness == 1 && 0.01 > Math.random()) {
            element.sprite = createImage(rottenApricot, 16);
            element.ripeness += 1;
        }
        
    }
}
function killZach() {
    zach.sprite=createImage(tombstone, 16);
    zach.alive=0;
}
//i want to have this like... idk even, i want to have shit comparing the timer variable
//but that odesnt matter, i can do all logic within this function
//becuase its only called when it advances anyways, anything else is unnecessary overhead(is that even the right word)
function timer(advance) {
    if (advance) {
        currentTime += 1;
        if(currentTime % 10 == 0) {
            ripenApricots();
        }
        zach.hunger -= 1;
        if(zach.hunger < 1) {
            killZach();
        }
    }
}
//player input
function pickApricot() {
    for (let index = 0; index < sceneObjects.length; index++) {
        const element = sceneObjects[index];
        //would break if it was weed instead of apricot, seperate check within loop for which one it is
        if (element.class == 'plant' && element.x == zach.x && element.y == zach.y && element.ripeness > 0) {
            sceneObjects.splice(index, 1);
            if (element.ripeness == 1) {
                //zach.apricotStash += 1;
                zach.hunger += 10;
            }
        }
        
    }
}

function controls() {
//im manually having each time a control happens increment a timer
//i want to have a generic "type" for action that i can apply to each one of these
//and then define them in such a way that each time one of these events happens the timer increments
//but maybe shitty javascript cant do that, who knows
    const left = zach.x-1;
    const right = zach.x+1;
    const up = zach.y-1;
    const down = zach.y+1;
    const stayX = zach.x;
    const stayY = zach.y;
    incrementTimer = false;
    if (zach.alive) {
        if ((keys["l"]||keys[6]) && !collisionCheck(zach.x+1, zach.y)){
            zach.x += 1
            incrementTimer = true;
        }
        if ((keys["h"]||keys[4]) && !collisionCheck(zach.x-1, zach.y)) {
            zach.x -= 1
            incrementTimer = true;
        }
        if ((keys["k"]||keys[8]) && !collisionCheck(zach.x, zach.y-1)) {
            zach.y -= 1
            incrementTimer = true;
        }
        if ((keys["j"]||keys[2]) && !collisionCheck(zach.x, zach.y+1)) {
            zach.y += 1
            incrementTimer = true;
            }
        if ((keys["y"]||keys[7]) && !collisionCheck(zach.x-1, zach.y-1)) {
            zach.x -= 1
            zach.y -= 1
            incrementTimer = true;
        }
        if ((keys["u"]||keys[9]) && !collisionCheck(zach.x+1, zach.y-1)) {
            zach.x += 1
            zach.y -= 1
            incrementTimer = true;
        }
        if ((keys["b"]||keys[1]) && !collisionCheck(zach.x-1, zach.y+1)) {
            zach.x -= 1
            zach.y += 1
            incrementTimer = true;
        }
        if ((keys["n"]||keys[3]) && !collisionCheck(zach.x+1, zach.y+1)) {
            zach.x += 1
            zach.y += 1
            incrementTimer = true;
        }
        if (keys[" "]) {
            pickApricot();
            incrementTimer = true;
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
        sprite: createImage(zachsCuteWall, 16),
        class : 'wall',
        x : x,
        y : y,
    }
    sceneObjects.push(wall);
}
function apricotConstructor(x, y) {
    let apricot = {
        sprite: createImage(unripeApricot, 16),
        class : 'plant',
        ripeness : 0,
        x : x,
        y : y
    }
    sceneObjects.push(apricot);
}
//STATIC IMMUTABLE OBJECTS DECLARED WITH BOILERPLATE FUCKING EWWW BRO
//I BET YOU PLAY HOGWARTS LEGACY TOO
let zach = {
    sprite : createImage(zachsCuteFace, 16),
    class : 'fuckboy',
    apricotStash : 0,
    hunger : 100,
    alive : true,
    x : 1,
    y : 1,
}

/* MAIN CONSTRUCTION
drawing map, spawning Zach, also other objects i need to implement */

//constructs walls, right now just a border around edges
function borderWall() {
    for (let index = 0; index < width; index++) {
        wallConstructor(index, 0);
        wallConstructor(index, height-1);
    }
    for (let index = 0; index < height; index++) {
        wallConstructor(0, index);
        wallConstructor(width-1, index);
    }
}
function lushApricotFields() {
    for (let x = 1; x < (width/2)-1; x++) {
        for(let y = 2; y < height-2; y++) {
            apricotConstructor(x*2, y)
        }
    }
}
borderWall();
render();
lushApricotFields();
sceneObjects.push(zach);

