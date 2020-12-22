let grid = new Grid(tileMap);
let player = new Point(11, 11);
let goalTiles = document.querySelectorAll('.tile-goal');

let audioPlayer = {
    blockGoal: new Audio('audio/Metal_Click.wav'),
    playerMove: new Audio('audio/click.wav'),
    winning: new Audio('audio/coin.wav')
};

let goalCounter = {
    count: 0,
    countGoal: goalTiles.length,

    incrementCount() {
        this.count++;
        if (this.count === this.countGoal){
            audioPlayer.winning.play();
            document.removeEventListener('keydown', moveHandler);
        }
    },

    decrementCount() {
        this.count--;
    }
};

let handleGoalCallback = function(mutationList, observer) {
    for (let mutation of mutationList) {
        handleAddedNode(mutation);
        handleRemovedNode(mutation);
    }
}

function handleAddedNode(mutation) {
    for (let node of mutation.addedNodes) {
        if (node.className === Entities.Block) {
            node.className = Entities.BlockDone;
            goalCounter.incrementCount(); 
            audioPlayer.blockGoal.play();
        }
    }
}

function handleRemovedNode(mutation) {
    for (let node of mutation.removedNodes) {
        if (node.className === Entities.BlockDone) {
            node.className = Entities.Block;
            goalCounter.decrementCount();
        }
    }
}

let goalObserver = new MutationObserver(handleGoalCallback);
let goalConfig = { childList: true };
goalTiles.forEach((node) => goalObserver.observe(node, goalConfig));

function isWall(point) {
    return grid.getGridCell(point).className === Tiles.Wall;
}

function move(playerPosition, direction) {
    let oneTileFromPlayer = direction(playerPosition);
    let twoTileFromPlayer = direction(oneTileFromPlayer);

    if (isWall(oneTileFromPlayer)){
        return playerPosition;
    }

    if (grid.hasElementAt(oneTileFromPlayer)) {
        if (grid.hasElementAt(twoTileFromPlayer) || isWall(twoTileFromPlayer)) {
            return playerPosition;
        } else {
            moveElement(oneTileFromPlayer, direction);
        }
    }

    moveElement(playerPosition, direction);
    audioPlayer.playerMove.play();
    return oneTileFromPlayer;
}

function moveElement(position, direction) {
    let element = grid.getElementAt(position);
    grid.removeElementAt(position, element);
    grid.appendElementAt(direction(position), element);
}

let direction = {
    'ArrowUp': (point) => new Point(point.x, point.y - 1),
    'ArrowDown': (point) => new Point(point.x, point.y + 1),
    'ArrowLeft': (point) => new Point(point.x - 1, point.y),
    'ArrowRight': (point) => new Point(point.x + 1, point.y),
}

function moveHandler(keyEvent) {
    if (direction[keyEvent.code] === undefined)
        return;

    keyEvent.preventDefault();
    player = move(player, direction[keyEvent.code]);
}

document.addEventListener('keydown', moveHandler);