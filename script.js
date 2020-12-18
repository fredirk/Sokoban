let gameBoard = document.getElementById('game-board');

function Point(x, y) {
    this.x = x;
    this.y = y;

    this.value = function() {
       return `(${this.x}, ${this.y})`; 
    }
}

class GameObject {
    constructor(point, element) {
        this.type = 'gameObject';
        this.point = point;
        this.element = element;
    }

    canMove() {}
    move() {}
}

function Player() {
    this.type = 'player';
    this.position = new Point(0, 0);
    this.element = null;
    this.direction = null;

    this.canMove = function(direction) {
        point = direction.nextPointFrom(this.position);
        return m[point.y][point.x].canMove(direction);
    }

    this.move = function(direction) {
        point = direction.nextPointFrom(this.position);
        m[point.y][point.x].move(direction);
        swapElementClasses(this.element, m[point.y][point.x].element);
        this.position = point;
    }
}

function Wall() {
    this.type = 'wall';
    this.position = new Point(0, 0);
    this.element = null;

    this.canMove = function(direction) {
        return false;
    }
    this.move = function(direction) {
    }
}

function Space() {
    this.type = 'space';
    this.position = new Point(0, 0);
    this.element = null;

    this.canMove = function(direction) {
        return true;
    }
    this.move = function(direction) {
    }
}

function Block() {
    this.type = "block";
    this.position = new Point(0, 0);
    this.element = null;
    this.direction = null;

    this.canMove = function(direction) {
        point = direction.nextPointFrom(this.position);
        return m[point.y][point.x].type == 'space'
    }

    this.move = function(direction) {
        point = direction.nextPointFrom(this.position);
        swapElementClasses(this.element, m[point.y][point.x].element);
        this.position = point;
    }
}

function swapElementClasses(elementA, elementB) {
    let temp = elementA.className;
    elementA.classList.remove(...elementA.className.split(' '));
    elementA.classList.add(...elementB.className.split(' '));
    elementB.classList.remove(...elementB.className.split(' '));
    elementB.classList.add(...temp.split(' '));
}

function prevColumn(entity) { 
    return entity.element.previousElementSibling; 
}
function nextColumn(entity) { 
    return entity.element.nextElementSibling; 
}
function nextRow(entity) { 
    return entity.element.parentNode.nextElementSibling.childNodes[entity.position.x]; 
}
function prevRow(entity){
    return entity.element.parentNode.previousElementSibling.childNodes[entity.position.x];
}

function Direction(entity, nextElement, point) { 
    this.entity = entity;
    this.nextElement = nextElement;
    this.nextPoint = point;

    this.nextPointFrom = function(position) {

    }

    this.move = function() {
        let nextElem = this.nextElement(this.entity);
        swapElementClasses(this.entity.element, nextElem);
        this.entity.element = nextElem;
        this.entity.position = this.nextPoint;
    }

   this.canMove = function() {
        if (this.entity.type === 'player') {
            if (tileMap.mapGrid[this.nextPoint.y][this.nextPoint.x] == 'W') 
                return false;
            else
                return true;
        } else if (this.entity.type === 'block') {
            return tileMap.mapGrid[point.y][point.x] == ' ';
        }
    }
}

function upDirection(entity) { 
    return new Direction(entity, prevRow, new Point(entity.position.x, entity.position.y - 1));
}
function downDirection(entity) { 
    return new Direction(entity, nextRow, new Point(entity.position.x, entity.position.y + 1));
}
function leftDirection(entity) { 
    return new Direction(entity, prevColumn, new Point(entity.position.x - 1, entity.position.y));
}
function rightDirection(entity) { 
    return new Direction(entity, nextColumn, new Point(entity.position.x + 1, entity.position.y));
}

let player = new Player();

document.onkeydown = function(e) {
    e.preventDefault();
    let direction = {
        'ArrowUp': upDirection(player),
        'ArrowDown': downDirection(player),
        'ArrowLeft': leftDirection(player),
        'ArrowRight': rightDirection(player),
    }

    if (direction[e.code] === undefined)
        return;
        
    player.direction = direction[e.code];

    if (player.direction.canMove())
        player.direction.move();
}

function initBoard(){
    var cssClasses = {
        ' ': Tiles.Space,
        'W': Tiles.Wall,
        'G': Tiles.Goal,
        'B': Entities.Block,
        'P': Entities.Character
    }

    for (var i = 0; i < tileMap.height; i++) {
        let tr = document.createElement('tr');
        gameBoard.appendChild(tr);
        for (var j = 0; j < tileMap.width; j++) {
            let td = document.createElement('td');
            let point = new Point(j, i);

            if (tileMap.mapGrid[i][j] == 'P') {
                player.position = point;
                player.element = td;
                console.log('player spawn: ' + player.position.value());
            }

            td.innerHTML = point.value();
            td.classList.add(...cssClasses[tileMap.mapGrid[i][j]].split(' '));
            tr.appendChild(td)

            td.style.color = "white";
            td.style.fontSize = "12px";
            td.style.textAlign = "center";
        }
    }
}

initBoard();