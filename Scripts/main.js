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

selection = {
    x: 3, 
    y: 4
}

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
            //delete map.gameObjects[key]
        } else {
            delete map.tiles[key]
        }
    } else {
        if (SelectedLayer === "gameObject") {

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
            // ...
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


/* 
var selection = {
    src: "/Assets/Tiles/grass.png",
    type: "grass",
    layer: "floor"
}

var isMouseDown = false
var layers = ["bottom", "floor", "middle", "gameObjects", "top"]

function addTile(event) {
    var clicked = getCoords(event)
    var key = clicked[0] + "-" + clicked[1] + "-" + (selection.layer || selection.type)
    
    if (selection != null) {
        console.log(key)
        if (event.shiftKey) {
            if (selection.layer === undefined) {
                delete map.gameObjects[key]
            } else {
                delete map.tiles[key]
            }
        } else if (event.altKey) {
            Object.keys(map.tiles).forEach(tileKey => {
                if (tileKey.includes(key.replace(`-${selection.layer}`, ""))) {
                    selection = map.tiles[tileKey]
                }
            })
            Object.keys(map.tiles).forEach(tileKey => {
                if (tileKey.includes(key.replace(`-${selection.type}`, ""))) {
                    selection = map.tiles[tileKey]
                }
            })
        } else {
            if (selection.layer === undefined) {
                selection.position.x = clicked[0] * 16
                selection.position.y = clicked[1] * 16
                map.gameObjects[key] = selection
            } else {
                map.tiles[key] = selection
            }
        }
    }
}


(() => {
    const step = () => {
        draw()
        setTimeout(() => {
            step()
        }, 200)
    }
    step()
})()

function getCoords(e) {
   const { x, y } = e.target.getBoundingClientRect()
   const mouseX = e.clientX - x
   const mouseY = e.clientY - y
   return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)]
}

function exportData() {
    tab = "    "
    var json = JSON.stringify(map)
/* `{
${tab}"id": "${map.id}",
${tab}"gameObjects": {\n`
    Object.keys(map.gameObjects).forEach(key => {
json += 
`${tab}${tab}"${map.gameObjects[key].id}": {
${tab}${tab}${tab}"id": "${map.gameObjects[key].id}",
${tab}${tab}${tab}"type": "${map.gameObjects[key].type}",
${tab}${tab}${tab}"playerControlled": ${map.gameObjects[key].playerControlled},
${tab}${tab}${tab}"position": {
${tab}${tab}${tab}${tab}"x": ${map.gameObjects[key].position.x},
${tab}${tab}${tab}${tab}"y": ${map.gameObjects[key].position.y},
${tab}${tab}${tab}${tab}"facing": "${map.gameObjects[key].position.facing}"
${tab}${tab}${tab}},
${tab}${tab}${tab}"src": "${map.gameObjects[key].src}"
${tab}${tab}}
`
    })
json += `${tab}},`
json += `
${tab}"tiles": {\n`
    Object.keys(map.tiles).forEach(key => {
json += 
`${tab}${tab}"${key}": {
${tab}${tab}${tab}"src": "${map.tiles[key].src}",
${tab}${tab}${tab}"type": "${map.tiles[key].type}",
${tab}${tab}${tab}"layer": "${map.tiles[key].layer}"
${tab}${tab}},
`
    })
json += `${tab}}`
    json += `\n}`
    console.log(json)
}
 
function draw() {
    let ctx = document.querySelector(".preview-canvas").getContext("2d")
    ctx.clearRect(0, 0, document.querySelector(".preview-canvas").width, document.querySelector(".preview-canvas").height)
    Object.values(layers).forEach(layer => {
        if (layer === "gameObjects") {
            Object.keys(map.gameObjects).forEach(key => { 
                var x = map.gameObjects[key].position.x
                var y = map.gameObjects[key].position.y
                var image = new Image()
                image.src = map.gameObjects[key].src
                ctx.drawImage(
                    image,
                    x * 2,
                    y * 2,
                    32,
                    32
                )
            })
        } else {
            Object.keys(map.tiles).forEach(key => { 
                if (map.tiles[key].layer === layer) {
                    let [ x, y ] = key.split("-")
                    let image = new Image()
                    image.src = map.tiles[key].src
                    ctx.drawImage(
                    image,
                    x * 32,
                    y * 32,
                    32,
                    32
                    )
                }
            })
        }
   })
} */