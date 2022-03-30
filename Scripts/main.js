// Map
let map = {
    id: "NewMap",
    gameObjects: {
        
    },
    tiles: {
        
    }
}

// Variables
let isMouseDown = false
let layers = ["bottom", "floor", "middle", "gameObject", "top"]
let SelectedLayer = "floor"
const tileSize = 24

let width = 30
let height = 20

let selection = {
    x: 3, 
    y: 4
}

let gameObjectSelection = {
    name: "barrier",
    type: "wall",
}

let gameObjects = {
    barrier: new Image()
}

gameObjects.barrier.src = "/assets/Tiles/barrier.png"

// Canvas Setup
document.querySelector(".preview-canvas").width = tileSize * width
document.querySelector(".preview-canvas").height = tileSize * height
document.querySelector(".tile-canvas").width = tileSize * 10
document.querySelector(".tile-canvas").height = tileSize * 6
let previewCTX = document.querySelector(".preview-canvas").getContext("2d")
let tileCTX = document.querySelector(".tile-canvas").getContext("2d")

// Init
let tileset = new Image()

tileset.src ="./Assets/Tiles/tileset.png"

tileset.onload = () => {
    tileCTX.drawImage(
        tileset,
        0, 
        0, 
        tileSize * 10,
        tileSize * 10
    )
}

// Functions
function getCoords(e) {
    const { x, y } = e.target.getBoundingClientRect()
    const mouseX = e.clientX - x
    const mouseY = e.clientY - y
    return { x: Math.floor(mouseX / tileSize), y: Math.floor(mouseY / tileSize) }
}

function selectTile(event) {
    selection = getCoords(event)
}

function addTile(event) {
    let currentSelection = getCoords(event)

    SelectedLayer = document.querySelector("input[name='radio']:checked").value
    let key = currentSelection.x + "-" + currentSelection.y + "-" + SelectedLayer


    if (event.shiftKey) {
        if (SelectedLayer === "gameObject") {
            delete map.gameObjects[key]
        } else {
            delete map.tiles[key]
        }
    } else {
        if (SelectedLayer === "gameObject") {
            map.gameObjects[key] = {
                ...gameObjectSelection,
                position : {
                    x: currentSelection.x, 
                    y: currentSelection.y
                }
            }
        } else {
            map.tiles[key] = {
                frame: {
                    x: selection.x, 
                    y: selection.y
                },
                position: {
                    x: currentSelection.x, 
                    y: currentSelection.y
                }
            }
        }
    }

    drawTiles()
}

function drawTiles() {
    previewCTX.clearRect(0, 0, document.querySelector(".preview-canvas").width, document.querySelector(".preview-canvas").height)
    
    layers.forEach(layer => {
        if (layer === "gameObject") {
            Object.values(map.gameObjects).forEach(object => {
                console.log(map)
                console.log(gameObjects)
                previewCTX.drawImage(
                    gameObjects[object.name],
                    object.position.x * tileSize,
                    object.position.y * tileSize,
                    tileSize,
                    tileSize
                )
            })
        } else { 
            tiles = Object.keys(map.tiles).filter(tile => tile.includes(layer))

            tiles.forEach(tile => {
                previewCTX.drawImage(
                    tileset,
                    map.tiles[tile].frame.x * tileSize, 
                    map.tiles[tile].frame.y * tileSize,
                    tileSize, 
                    tileSize,
                    map.tiles[tile].position.x * tileSize,
                    map.tiles[tile].position.y * tileSize,
                    tileSize,
                    tileSize
                )
            })
        }
    })
}

// Listeners
document.querySelector(".tile-canvas").addEventListener("click", (event) => {
    selectTile(event)
})

document.querySelector(".increase-width").onclick = () => {
    width++
    document.querySelector(".preview-canvas").width = tileSize * width
    drawTiles()
}

document.querySelector(".increase-height").onclick = () => {
    height++
    document.querySelector(".preview-canvas").height = tileSize * height
    drawTiles()
}

document.querySelector(".preview-canvas").addEventListener("mousedown", (event) => {
    addTile(event)
    isMouseDown = true
})

document.querySelector(".preview-canvas").addEventListener("mouseup", () => {
    isMouseDown = false
})

document.querySelector(".preview-canvas").addEventListener("mouseleave", () => {
    isMouseDown = false
})

document.querySelector(".preview-canvas").addEventListener("mousemove", event => {
    if (isMouseDown) {
        addTile(event)
    }
})

document.querySelector("#barrier").addEventListener("click", (event) => {
    gameObjectSelection = {
        name: "barrier",
        type: "wall",
    }
})

function exportData() {
    console.log(JSON.stringify(map))
}
