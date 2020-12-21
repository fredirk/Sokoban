let grid = new Grid(tileMap);
let player = new Point(11, 11);
let tileGoals = document.querySelectorAll('.tile-goal');

let audioPlayer = {
    blockGoal: new Audio('audio/Metal_Click.wav'),
    playerMove: new Audio('audio/click.wav'),
    winning: new Audio('audio/coin.wav')
};

let goalCounter = {
    count: 0,
    countGoal: tileGoals.length,

    incrementCount() {
        this.count++;
        console.log(this.count);

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
tileGoals.forEach((node) => goalObserver.observe(node, goalConfig));

function isWall(point) {
    return grid.getGridCell(point).className === Tiles.Wall;
}

function move(position, direction) {
    let oneTileFromPosition = direction(position);
    let twoTileFromPosition = direction(oneTileFromPosition);

    if (isWall(oneTileFromPosition)){
        return position;
    }

    if (grid.hasElementAt(oneTileFromPosition)) {
        if (!grid.hasElementAt(twoTileFromPosition) && !isWall(twoTileFromPosition)) {
            let blockElement = grid.getElementAt(oneTileFromPosition);
            grid.removeElementAt(oneTileFromPosition, blockElement);
            grid.appendElementAt(twoTileFromPosition, blockElement);
        } else {
            return position;
        }
    }

    let element = grid.getElementAt(position);
    grid.removeElementAt(position, element);
    grid.appendElementAt(oneTileFromPosition, element);
    audioPlayer.playerMove.play();
    return oneTileFromPosition;
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