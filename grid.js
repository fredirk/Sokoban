let tileClass = {
    ' ': Tiles.Space,
    'W': Tiles.Wall,
    'G': Tiles.Goal,
}

let entityClass = {
    'B': Entities.Block,
    'P': Entities.Character
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

class Grid {
    constructor(tileMap) {
        this.initializeGridElements(tileMap);
    }

    initializeGridElements(tileMap){
        this.gridTable = document.createElement('table'); 
        document.body.appendChild(this.gridTable);

        for (let i = 0; i < tileMap.height; i++) {
            let gridRow = this.gridTable.insertRow();
            for (let j = 0; j < tileMap.width; j++) {
                let gridCell = gridRow.insertCell();
                let tile = tileClass[tileMap.mapGrid[i][j]];
                if (tile === undefined) {
                    let entityElement = document.createElement('div');
                    entityElement.className = entityClass[tileMap.mapGrid[i][j]];
                    gridCell.className = Tiles.Space;
                    gridCell.appendChild(entityElement);
                } else {
                    gridCell.className = tileClass[tileMap.mapGrid[i][j]];
                }
            }
        }
    }

    hasElementAt(point) {
        return this.getGridCell(point).hasChildNodes();
    }

    getElementAt(point) {
        return this.getGridCell(point).firstChild;
    }

    appendElementAt(point, element) {
        this.getGridCell(point).appendChild(element);
    }

    removeElementAt(point, element) {
        this.getGridCell(point).removeChild(element);
    }

    getGridCell(point) {
        return this.gridTable.firstElementChild.childNodes[point.y].childNodes[point.x];
    }
}