var map = {
    id: "NewMap",
    gameObjects: {

    },
    tiles: {

    }
}


document.querySelector(".preview-canvas").width = 32 * 30
document.querySelector(".preview-canvas").height = 32 * 20

var selection = {
    src: "/Assets/Tiles/grass.png",
    type: "grass",
    layer: "floor"
}
var isMouseDown = false
var layers = ["bottom", "floor", "middle", "gameObjects", "top"]

function addTile(event) {
    var clicked = getCoords(event)
    var key = clicked[0] + "-" + clicked[1] + "-" + (selection.layer || "")
    if (event.shiftKey) {
        if (selection.layer === undefined) {
            delete map.gameObjects[selection.id]
        } else {
            delete map.tiles[key]
        }
    } else {
        if (selection.layer === undefined) {
            selection.position.x = clicked[0] * 16
            selection.position.y = clicked[1] * 16
            map.gameObjects[selection.id] = selection
        } else {
            map.tiles[key] = selection
        }
    }
    draw()
}

let delay = 0

document.querySelector(".preview-canvas").addEventListener("mousedown", () => {
    isMouseDown = true
    delay = 0
})

document.querySelector(".preview-canvas").addEventListener("mouseup", () => {
    isMouseDown = false
})

document.querySelector(".preview-canvas").addEventListener("mouseleave", () => {
    isMouseDown = false
})

document.querySelector(".preview-canvas").addEventListener("mousedown", addTile)

document.querySelector(".preview-canvas").addEventListener("mousemove", event => {
    if (isMouseDown) {
        if (delay < 1) {
            addTile(event)
            delay = 5
        } else {
            delay--
        }
    }
})

document.querySelector(".barrier").addEventListener("mousedown", () => {
    selection = {
        src: "/Assets/Tiles/barrier.png",
        type: "barrier",
        layer: "top"
    }
})

document.querySelector(".grass").addEventListener("mousedown", () => {
    selection = {
        src: "/Assets/Tiles/grass.png",
        type: "grass",
        layer: "floor"
    }
})

document.querySelector(".path").addEventListener("mousedown", () => {
    selection = {
        src: "/Assets/Tiles/path.png",
        type: "path",
        layer: "floor"
    }
})

document.querySelector(".character").addEventListener("mousedown", () => {
    selection = {
        id: "player",
        type: "character",
        playerControlled: true,
        position: {
            x: 0,
            y: 0,
            facing: "down"
        },
        src: "/Assets/Sprites/player-large.png"
    }
})

function getCoords(e) {
   const { x, y } = e.target.getBoundingClientRect()
   const mouseX = e.clientX - x
   const mouseY = e.clientY - y
   return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)]
}

function exportData() {
    tab = "    "
    var json = 
`{
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
    var ctx = document.querySelector(".preview-canvas").getContext("2d")
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
                )
            })
        } else {
            Object.keys(map.tiles).forEach(key => { 
                var x = Number(key.split("-")[0])
                var y = Number(key.split("-")[1])
                var image = new Image()
                image.src = map.tiles[key].src
                ctx.drawImage(
                   image,
                   x * 32,
                   y * 32,
                )
            })
        }
   })
}