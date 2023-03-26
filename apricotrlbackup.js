const canvas = document.getElementById("apricotrl");
canvas.width = 1280;
canvas.height = 384;
const ctx = canvas.getContext("2d");
let keys= [];
let sceneObjects = [];

function createImage(url) {
    let image = new Image(16, 16);
    image.src = url;
    return image;
}
function drawOnGrid(obj) {
    ctx.drawImage(obj.sprite, obj.x * 16, obj.y * 16);
}
let zachsCuteFace = createImage("/apricotrl/tiles/Characters/zach.png");
let zachsCuteWall = createImage("/apricotrl/tiles/Objects/shittywall.png");
let zach = {
    sprite : zachsCuteFace,
    x : 1,
    y : 1,
}
function wallConstructor(x, y) {
    let wall = {
        sprite: zachsCuteWall,
        x : x,
        y : y,
    }
    sceneObjects.push(wall);
}
for (let index = 0; index <= 80; index++) {
    wallConstructor(index, 0);
    wallConstructor(index, 23);
}
for (let index = 0; index <= 24; index++) {
    wallConstructor(0, index);
    wallConstructor(79, index);
}

function collisionCheck(x, y) {
    for (let index = 0; index < sceneObjects.length; index++) {
        let object = sceneObjects[index];
        if(object.x == x && object.y == y) {
            return true;
        }
    }
    return false;
}
sceneObjects.push(zach);

let sceneWidth = 1280;
let sceneHeight = 384;

function render(){
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, sceneWidth, sceneHeight);
    for (let index = 0; index < sceneObjects.length; index++) {
        let object = sceneObjects[index];
        drawOnGrid(object);
    }
    controls();
    requestAnimationFrame(render);
}
render();
function controls() {
    if (keys["d"] && !collisionCheck(zach.x+1, zach.y)){
        zach.x += 1
    }
    if (keys["a"] && !collisionCheck(zach.x-1, zach.y)) {
        zach.x -= 1
    }
    if (keys["w"] && !collisionCheck(zach.x, zach.y-1)) {
        zach.y -= 1
    }
    if (keys["s"] && !collisionCheck(zach.x, zach.y+1)) {
        zach.y += 1
    }
}
document.body.onkeydown = function(e){
    keys[e.key]=true;
}

document.body.onkeyup = function(e){
    keys[e.key]=false;
}
//16x16 tiles
//