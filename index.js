const canvas = document.querySelector("canvas") // Wybranie elementu canvas
const c = canvas.getContext('2d') // Pobierz kontekst rysowania 2D dla elementu canvas

const ingameScore = document.querySelector("#ingameScore")
const ingameTime = document.querySelector("#ingameTime")

// Dodaj element HTML dla menu
const menuElement = document.createElement('div')
menuElement.innerHTML = `
    <h1>Mushroom Picker</h1>
    <p id="score">Your score: 0</p>
    <button id="start-button">Start Game</button>
    <img src="./img/Mushroom Picker Game Menu.png">
`
document.body.appendChild(menuElement) // Dodaje menuElement do ciała dokumentu HTML, umieszczając je na stronie.


// Funkcja rozpoczynająca grę po kliknięciu przycisku "Start Game"
function startGame() {

// Ukryj menu
menuElement.style.display = 'none'
// Pokaż grę
canvas.style.display = 'grid'

ingameScore.style.visibility = 'visible'
ingameTime.style.visibility = 'visible'

// Wymiary wyrenderowanej gry
canvas.width = 1024
canvas.height = 576

const offset = {
    x: -1185, // Przesunięcie canvasu w poziomie
    y: -650   // Przesunięcie canvasu w pionie
}

// Tworzenie mapy kolizji na podstawie danych z tablicy collisions
// Tablica dwuwymiarowa gdzie każdy index to jest pojedyńczy rząd mapy
// Wymiary mapy: 70 w poziomie, 40 w pionie
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const boundaries = [] // Tablica przechowująca obiekty granic
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

// Tworzenie mapy stref grzybów na podstawie danych z tablicy mushroomZonesData
const mushroomZonesMap = []
for (let i = 0; i < mushroomZonesData.length; i += 70) {
    mushroomZonesMap.push(mushroomZonesData.slice(i, 70 + i))
}
    
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
const mushroomsPosition = [] // Przechowuje pozycję
const whichMushrooms = []

// Funkcja generująca miejsca dla grzybów
function newGameMushrooms() {
    const selectedMushroomPlaces = []
    const minimumBoletusCount = 10 // Minimalna liczba grzybów typu './img/boletus.png'

    while (selectedMushroomPlaces.length < 15) {
        const index = Math.floor(Math.random() * mushroomZones.length)
        // Sprawdź, czy wylosowany indeks nie został wcześniej wybrany
        if (!selectedMushroomPlaces.includes(index)) {
            selectedMushroomPlaces.push(index) // Dodaj unikalny indeks do tablicy
        }
    }

    // Wylosuj miejsca dla minimumBoletusCount grzybów typu './img/boletus.png'
    for (let i = 0; i < minimumBoletusCount; i++) {
        let index = Math.floor(Math.random() * selectedMushroomPlaces.length)
        let position = selectedMushroomPlaces.splice(index, 1)[0] // Usuń wylosowany indeks i zapisz jego wartość

        const mushroomImage = new Image()
        const mushroomZone = mushroomZones[position]

        whichMushrooms.push('./img/boletus.png'); // Dodaj adres URL obrazka do tablicy

        // Przypisz adres URL do obiektu obrazka
        mushroomImage.src = './img/boletus.png'

        const mushroom = new MushroomZones({
            position: {
                x: mushroomZone.position.x,
                y: mushroomZone.position.y
            },
            image: mushroomImage
        });

        mushroomsPosition.push(mushroom) // Dodaj grzyb do tablicy grzybów
    }

    // Wylosuj miejsca dla pozostałych grzybów typu './img/toadstool.png'
    selectedMushroomPlaces.forEach(position => {
        const mushroomImage = new Image()
        const mushroomZone = mushroomZones[position]

        const src = Math.random() > 0.5 ? './img/toadstool.png' : './img/boletus.png'

        whichMushrooms.push(src) // Dodaj adres URL obrazka do tablicy

        // Przypisz adres URL do obiektu obrazka
        mushroomImage.src = src

        const mushroom = new MushroomZones({
            position: {
                x: mushroomZone.position.x,
                y: mushroomZone.position.y
            },
            image: mushroomImage
        })
        mushroomsPosition.push(mushroom) // Dodaj grzyb do tablicy grzybów
    })
}

newGameMushrooms();

// Zamiast gracza porusza się mapa, tablica zawiera elementy, którę będą się ruszać
const movables = [background, ...boundaries, foreground, ...mushroomZones, ...mushroomsPosition]

// Funkcja sprawdzająca kolizje
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

let points = 0 // Liczba punktów na start gry
document.querySelector("#actuallScore").textContent = points
let timeRemaining = 60 // Długość gry w sekundach
let gameIsOver = false // Flaga wskazująca, czy gra się zakończyła

// Funkcja aktualizująca czas co sekundę
function updateTimer() {
    timeRemaining-- // Dekrementacja pozostałego czasu
    document.querySelector("#timeLeft").textContent = `${timeRemaining}s`

    // Sprawdzenie, czy czas się skończył
    if (timeRemaining <= 0) {
        clearInterval(timerInterval) // Zatrzymanie odświeżania czasu
        gameIsOver = true // Ustawienie flagi o zakończeniu gry
    }
}

// Uruchomienie funkcji updateTimer() co sekundę
const timerInterval = setInterval(updateTimer, 1000)

// Funkcja do zbierania punktów
function collectMushroom() {
    // Sprawdź, czy czas się skończył
    if (timeRemaining > 0) {
        let collectedBoletus = 0
        let collectedToadstool = 0
        const removedIndices = []

        for (let i = 0; i < mushroomsPosition.length; i++) {
            const mushroom = mushroomsPosition[i]
            if (rectangularCollision({ rectangle1: player, rectangle2: mushroom })) {
                if (whichMushrooms[i] === './img/boletus.png') {
                    collectedBoletus++
                } else if (whichMushrooms[i] === './img/toadstool.png') {
                    collectedToadstool++
                }

                removedIndices.push(i)
            }
        }

        for (let i = removedIndices.length - 1; i >= 0; i--) {
            const index = removedIndices[i]
            mushroomsPosition.splice(index, 1)
            whichMushrooms.splice(index, 1)
        }

        // Dodawanie punktów za zebrane grzyby boletus
        points += collectedBoletus

        // Odejmowanie punktów za zebrane grzyby toadstool
        points -= collectedToadstool

        // Sprawdzenie, czy liczba punktów nie spadła poniżej zera
        if (points < 0) {
            points = 0
        }

        document.querySelector("#actuallScore").textContent = points

        // Sprawdź, czy na mapie znajduje się co najmniej 10 grzybów boletus
        const boletusCount = whichMushrooms.filter(src => src === './img/boletus.png').length
        if (boletusCount < 10) {
            // Wygeneruj nowego grzyba boletus
            const index = Math.floor(Math.random() * mushroomZones.length)
            const mushroomZone = mushroomZones[index]
            const mushroomImage = new Image()
            const src = './img/boletus.png'

            whichMushrooms.push(src)

            // Przypisz adres URL do obiektu obrazka
            mushroomImage.src = src

            const mushroom = new MushroomZones({
                position: {
                    x: mushroomZone.position.x,
                    y: mushroomZone.position.y
                },
                image: mushroomImage
            })

            mushroomsPosition.push(mushroom); // Dodaj grzyb do tablicy grzybów

            // Dodaj nowego grzyba do tablicy movables
            movables.push(mushroom)
        }
    } else {
        // console.log("Time is up! You can't collect points anymore.")
    }
}


// Funkcja obsługująca klawiaturę
function handleKeyPress(e) {
    if (e.key === 'e') {
        collectMushroom();
        let collectedBoletus = 0
        let collectedToadstool = 0

        const removedIndices = []

        for (let i = 0; i < mushroomsPosition.length; i++) {
            const mushroom = mushroomsPosition[i]
            if (rectangularCollision({ rectangle1: player, rectangle2: mushroom })) {
                if (whichMushrooms[i] === './img/boletus.png') {
                    collectedBoletus++
                } else if (whichMushrooms[i] === './img/toadstool.png') {
                    collectedToadstool++
                }

                removedIndices.push(i)
            }
        }

        for (let i = removedIndices.length - 1; i >= 0; i--) {
            const index = removedIndices[i]
            mushroomsPosition.splice(index, 1)
            whichMushrooms.splice(index, 1)
        }

        // Dodawanie punktów za zebrane grzyby boletus
        points += collectedBoletus

        // Odejmowanie punktów za zebrane grzyby toadstool
        points -= collectedToadstool

        // Sprawdzenie, czy liczba punktów nie spadła poniżej zera
        if (points < 0) {
            points = 0
        }

        // console.log('Points:', points)

        // Generowanie nowego grzyba
        while (mushroomsPosition.length < 15) {
            const index = Math.floor(Math.random() * mushroomZones.length)
            const mushroomZone = mushroomZones[index]
            const mushroomImage = new Image()
            const src = Math.random() > 0.5 ? './img/toadstool.png' : './img/boletus.png'
            whichMushrooms.push(src)

            mushroomImage.src = src

            const mushroom = new MushroomZones({
                position: {
                    x: mushroomZone.position.x,
                    y: mushroomZone.position.y
                },
                image: mushroomImage
            })

            mushroomsPosition.push(mushroom)

            // Dodawanie nowego grzyba do tablicy movables
            movables.push(mushroom)
        }
    }
}

// Funkcja animacji gry
function animate() {

    if (gameIsOver) {
        canvas.style.display = 'none';
        ingameScore.style.visibility = 'hidden'
        ingameTime.style.visibility = 'hidden'
        menuElement.style.display = 'grid';
        pScore = document.querySelector('#score');
        lastScore = points;
        pScore.textContent = `Your score: ${lastScore}`;
        timeRemaining = 60;
        document.querySelector("#timeLeft").textContent = `${timeRemaining}s`;
        document.querySelector("#actuallScore").textContent = 0;
        return;
    }
    
    // Rysowanie obiektów
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    // Rusuje miejsca gdzie może się zrespić grzyb
    mushroomZones.forEach(mushroomZone => {
        mushroomZone.draw()
    })
    // Rysuje każdego grzyba z listy mushroomsPosition
    mushroomsPosition.forEach(mushroomPosition => {
        mushroomPosition.drawMushroom()
    })
    
    player.draw()
    foreground.draw()

    // Aktualizacja czasu i punktów
    // document.getElementById('ingameScore').textContent = `Score: ${points}`;
    // document.getElementById('ingameTime').textContent = `Time left: ${timeRemaining}s`;
    
    // Uruchamia funkcję animate() w każdej klatce animacji, zapewniając płynność ruchu i aktualizację obiektów na ekranie.
    window.requestAnimationFrame(animate)

    let moving = true
    player.moving = false

    for (let i = 0; i < mushroomsPosition.length; i++) {
        const mushroomPosition = mushroomsPosition[i]

        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: mushroomPosition
            })
        ) {
            window.addEventListener('keydown', handleKeyPress)
            break
        }
    }
    
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
    animate();
}

// Dodaj obsługę kliknięcia przycisku "Start Game"
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);