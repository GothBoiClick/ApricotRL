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

//sprites
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

//arrays
let sceneItems = [];
let scenePlants = [];
let scenePlayer = [];
let sceneWalls = [];
let playerItems = []; //currently global array, more sense to have it be constructed as a property of the Actor object

//classes

//is this even needed? it's just two fields
class ThingBlueprint {
    constructor(name, sprite) {
        this.name = name;
        this.sprite = sprite;
    }
}
class Actor extends ThingBlueprint {
    constructor(name, sprite, x, y) {
        super(name, sprite);
        this.hunger = 100;
        this.alive = true;
        this.x = x;
        this.y = y;
    }
    moveActor(newX, newY) {
        if (!collisionCheck(newX, newY)) {
            this.x = newX
            this.y = newY
            //return true or false depending on success to set timer if Zach moves
            return true;
        }
        return false;
    }
    killActor() {
        this.sprite=TOMBSTONE;
        this.alive=0;
    }
}
//no need to make this an extension of ThingBlueprint now, later might be useful to so i can easily fit in other building tiles or something? but even then its not very useful
class Wall {
    constructor(sprite, x, y) {
        this.name = 'wall';
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        sceneWalls.push(this);
    }
}
//
class Plant extends ThingBlueprint{
    constructor(name, sprite, x, y) {
        super(name, sprite);
        this.ripeness = -1;
        this.x = x;
        this.y = y;
        scenePlants.push(this);
    }
    advanceGrowth() { //make this generic when weed is implemented
        if (this.ripeness < 0 && 0.1 > Math.random()) {
            this.sprite == APRICOTPLANTUNRIPE;
            this.ripeness += 1;
        }
        if (this.ripeness == 0 && 0.05 > Math.random()) {
            this.sprite = APRICOTPLANTRIPE;
            this.ripeness += 1;
        }
        if (this.ripeness == 1 && 0.01 > Math.random()) {
            this.sprite = APRICOTPLANTROTTEN;
            this.ripeness += 1;
        }
    }
    resetGrowth() {
        this.sprite = APRICOTPLANTBARE;
        this.ripeness = -1;
    }
}
let zach = new Actor('zach', ZACHFACE, WIDTH/2, 1);
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
//initializing variables
let cooldown = 0;
let currentTime = 0;
//timer here since controls pretty much "controls" it
const growPlants = () => {
    for (let index = 0; index < scenePlants.length; index++) {
        const plant = scenePlants[index];
        plant.advanceGrowth();
        
    }
}
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
        (zach.hunger < 11 && zach.hunger > 0) ? console.log('eat something quick!') : 1+1;
        if(zach.hunger < 1) {
            zach.killActor();
            console.log('uh oh, you fucking starved to death!')
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
            zach.moveActor(right, currentY) ? incrementTimer = true : incrementTimer = false;
        }
        if (keys["h"]||keys[4]){
            zach.moveActor(left, currentY) ? incrementTimer = true : incrementTimer = false;
        }
        if (keys["k"]||keys[8]) {
            zach.moveActor(currentX, up) ? incrementTimer = true : incrementTimer = false;
        }
        if (keys["j"]||keys[2]) {
            zach.moveActor(currentX, down) ? incrementTimer = true : incrementTimer = false;
            }
        if (keys["y"]||keys[7]) {
            zach.moveActor(left, up) ? incrementTimer = true : incrementTimer = false;
        }
        if (keys["u"]||keys[9]) {
            zach.moveActor(right, up) ? incrementTimer = true : incrementTimer = false;
        }
        if (keys["b"]||keys[1]) {
            zach.moveActor(left, down) ? incrementTimer = true : incrementTimer = false;
        }
        if (keys["n"]||keys[3]) {
            zach.moveActor(right, down) ? incrementTimer = true : incrementTimer = false;
        }
        if (keys[" "]) {
            useApricotPlant();
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
            eatFood(apricot) ? console.log("MY GOD, IT'S SO JUICY!") :
            console.log('out of apricots!');
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

//player input
function useApricotPlant() {
    for (let index = 0; index < scenePlants.length; index++) {
        const plant = scenePlants[index];
        //would break if it was weed instead of apricot, seperate check within loop for which one it is
        if (plant.x == zach.x && plant.y == zach.y && plant.ripeness > 0) {
            if (plant.ripeness == 1) {
                zach.hunger += 11;
            } // needs to be before ripeness change to work i think
            plant.resetGrowth();
            incrementTimer=true;
        }
    }
}
function getFloorItem() {
    for (let index = 0; index < sceneItems.length; index++) {
        const floorItem = sceneItems[index];
        let inInventory = false;
        if (floorItem.x == zach.x && floorItem.y == zach.y) {
            for (let index = 0; index < playerItems.length; index++) {
                const inventoryItem = playerItems[index];
                if (inventoryItem.name = floorItem.name) {
                    inventoryItem.quantity += 1;
                    inInventory = true;
                }
            }
            if (!inInventory)  {
                playerItems.push(floorItem);
            }
            sceneItems.splice(index, 1);
        }
    }
}
function inInventory(item) {
    for (let index = 0; index < playerItems.length; index++) {
        const inventoryItem = playerItems[index];
        if (inventoryItem.name = item) {
            return true;
        } 
    }
    return false;
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

function eatFood(type) {
    for (let index = 0; index < playerItems.length; index++) {
        let item = playerItems[index];
        if (item.name == type.name) {
            item.quantity -= 1;
            zach.hunger += 11;
            if (item.quantity < 1) {
                playerItems.splice(index, 1);
            }
            incrementTimer = true;
            return true;
        }
    }
    return false;
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
        new Wall(WALL, index, 0);
        new Wall(WALL, index, HEIGHT-1);
    }
    for (let index = 0; index < HEIGHT; index++) {
        new Wall(WALL, 0, index);
        new Wall(WALL, WIDTH-1, index);
    }
}
function lushApricotFields() {
    for (let x = WIDTH/4; x < (WIDTH/2); x++) {
        for(let y = 2; y < HEIGHT-2; y++) {
            new Plant('apricotTree', APRICOTPLANTUNRIPE, x*2-1, y)
        }
    }
}
borderWall();
lushApricotFields();
scenePlayer.push(zach);
//hey check out my sex toys youtube bros10function ingYourMo600600600)
