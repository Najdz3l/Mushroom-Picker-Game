const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')

// Wymiary wyrenderowanej gry
canvas.width = 1024
canvas.height = 576

// Tworzenie mapy kolizji na podstawie danych z tablicy collisions
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

// Tworzenie mapy stref grzybów na podstawie danych z tablicy mushroomZonesData
const mushroomZonesMap = []
for (let i = 0; i < mushroomZonesData.length; i += 70) {
    mushroomZonesMap.push(mushroomZonesData.slice(i, 70 + i))
}

const boundaries = [] // Tablica przechowująca obiekty granic
const offset = {
    x: -1185, // Przesunięcie w poziomie
    y: -650   // Przesunięcie w pionie
}

// Iteracja po mapie kolizji w celu utworzenia granic
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) // Symbol 1025 oznacza zaznaczony na mapie obszar
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }
        ))
    })
})

const mushroomZones = [] // Tablica przechowująca obiekty stref grzybów

// Iteracja po mapie stref grzybów w celu utworzenia stref grzybów
mushroomZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) // Symbol 1025 oznacza zaznaczony na mapie obszar
        mushroomZones.push(
            new MushroomZones({
                position: {
                    x: j * MushroomZones.width + offset.x,
                    y: i * MushroomZones.height + offset.y
                }
            }
        ))
    })
})
// console.log(mushroomZones)

// Ładowanie obrazów

const image = new Image()
image.src = './img/Mushroom Picker Game Map.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foreground objects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const mushroomToadstoolImage = new Image()
mushroomToadstoolImage.src = './img/toadstool.png'

const mushroomBoletusImage = new Image()
mushroomBoletusImage.src = './img/boletus.png'


const mushroomToadstool = new Sprite({
    position: {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    image: mushroomToadstoolImage
})

const mushroomBoletus = new Sprite({
    position: {
        x: 351,
        y: -170
    },
    image: mushroomBoletusImage
})

console.log(mushroomZones)


// Inicjalizacja gracza
const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

// Inicjalizacja tła
const background = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

// Inicjalizacja obiektów na pierwszym planie
const foreground = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

// Tablica przechowująca klawiszę sterowania
const keys = {

    w: {
        pressed: false
    },

    a: {
        pressed: false
    },

    s: {
        pressed: false
    },

    d: {
        pressed: false
    },

    ArrowUp: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },

    ArrowDown: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    }
}

// Funckja losująca pierwsze 15 grzybów na mapie
// Losuje 15 losowych i nie powtarzajacych sie position z arraya mushroomZones

selectedMushroomPlaces = []
const mushrooms = []

// Funkcja generująca miejsca dla grzybów
function newGameMushrooms() {
    while (selectedMushroomPlaces.length < 15) {
        const index = Math.floor(Math.random() * mushroomZones.length);
        // Sprawdź, czy wylosowany indeks nie został wcześniej wybrany
        if (!selectedMushroomPlaces.includes(index)) {
            selectedMushroomPlaces.push(index) // Dodaj unikalny indeks do tablicy
        }
    }
    console.log(selectedMushroomPlaces); // Wyświetl wybrane miejsca


    // Tworzenie grzybów na wybranych obszarach
    for (let i = 0; i < 15; i++) {
        const mushroomZone = mushroomZones[selectedMushroomPlaces[i]] // Pobierz obszar, na którym ma pojawić się grzyb wykorzystując wcześniej wylosowane indeksy
        const mushroom = new MushroomZones({
            position: {
                x: mushroomZone.position.x,
                y: mushroomZone.position.y
            },
            image: mushroomBoletusImage
        });
        mushrooms.push(mushroom); // Dodaj grzyb do tablicy grzybów
    }
    
    // Wyświetl utworzone grzyby
    console.log(mushrooms)
}
newGameMushrooms()

// Zamiast gracza porusza się mapa, tablica zawiera elementy, którę będą się ruszać
const movables = [background, ...boundaries, foreground, ...mushroomZones, ...mushrooms, mushroomToadstool, mushroomBoletus]

// Funkcja sprawdzająca kolizje
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}



// Funkcja animacji gry
function animate() {
    // Uruchamia funkcję animate() w każdej klatce animacji, zapewniając płynność ruchu i aktualizację obiektów na ekranie.
    window.requestAnimationFrame(animate)

    // newGameMushrooms()
    
    // Rysowanie obiektów
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    mushroomZones.forEach(mushroomZone => {
        mushroomZone.draw()
    })
    mushrooms.forEach(mushroom => {
        mushroom.drawMushroom()
    })


    player.draw()
    foreground.draw()

    let moving = true
    player.moving = false

    // Obsługa ruchu mapy
    if (keys.w.pressed && lastKey === 'w') {
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 2
                    }}
                })
            ) {
                // console.log('colliding')
                moving = false
                break
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.y += 2
            })
        }
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 2,
                        y: boundary.position.y
                    }}
                })
            ) {
                // console.log('colliding')
                moving = false
                break
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.x += 2
            })
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 2
                    }}
                })
            ) {
                // console.log('colliding')
                moving = false
                break
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.y -= 2
            })
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 2,
                        y: boundary.position.y
                    }}
                })
            ) {
                // console.log('colliding')
                moving = false
                break
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.x -= 2
            })
        }
    }
    else if (keys.ArrowUp.pressed && lastKey === "ArrowUp") {
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 2
                    }}
                })
            ) {
                // console.log('colliding')
                moving = false
                break
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.y += 2
            })
        }
    }
    else if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 2,
                        y: boundary.position.y
                    }}
                })
            ) {
                // console.log('colliding')
                moving = false
                break
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.x += 2
            })
        }
    }
    else if (keys.ArrowDown.pressed && lastKey === "ArrowDown") {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 2
                    }}
                })
            ) {
                // console.log('colliding')
                moving = false
                break
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.y -= 2
            })
        }
    }
    else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 2,
                        y: boundary.position.y
                    }}
                })
            ) {
                // console.log('colliding')
                moving = false
                break
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.x -= 2
            })
        }
    }
}

animate()

let lastKey = ''
// Obsługa naciśnięcia klawiszy
window.addEventListener('keydown', (e) => {

    switch (e.key) {

        case 'w': 
            keys.w.pressed = true
            lastKey = 'w'
            break;

        case 'a': 
            keys.a.pressed = true
            lastKey = 'a'
            break;

        case 's': 
            keys.s.pressed = true
            lastKey = 's'
            break;

        case 'd': 
            keys.d.pressed = true
            lastKey = 'd'
            break;

        case "ArrowUp": 
            keys.ArrowUp.pressed = true
            lastKey = "ArrowUp"
            break;

        case "ArrowLeft": 
            keys.ArrowLeft.pressed = true
            lastKey = "ArrowLeft"
            break;

        case "ArrowDown": 
            keys.ArrowDown.pressed = true
            lastKey = "ArrowDown"
            break;

        case "ArrowRight": 
            keys.ArrowRight.pressed = true
            lastKey = "ArrowRight"
            break;
    }
})

// Obsługa zwolnienia klawiszy
window.addEventListener('keyup', (e) => {

    switch (e.key) {

        case 'w': 
            keys.w.pressed = false
            break;

        case 'a': 
            keys.a.pressed = false
            break;

        case 's': 
            keys.s.pressed = false
            break;

        case 'd': 
            keys.d.pressed = false
            break;

        case "ArrowUp": 
            keys.ArrowUp.pressed = false
            break;

        case "ArrowLeft": 
            keys.ArrowLeft.pressed = false
            break;

        case "ArrowDown": 
            keys.ArrowDown.pressed = false
            break;

        case "ArrowRight": 
            keys.ArrowRight.pressed = false
            break;
    }
})