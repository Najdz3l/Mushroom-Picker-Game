class Sprite {
    constructor({ position, image, frames = { max: 1 }, sprites }) {
        this.position = position
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width, // Szerokość zaczęcia przycięcia
            0, // Wysokość zaczęcia przycięcia
            this.image.width / this.frames.max, // Szerokość zakończenia przycięcia
            this.image.height, // Wysokość zakończenia przycięca
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )

        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 30 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

class Boundary {
    static width = 48
    static height = 48

    constructor({ position}) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw() {
        // c.fillStyle = 'rgba(255, 0, 0, 0.5)' // Wyświetl boundaries
        c.fillStyle = 'rgba(255, 0, 0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class MushroomZones {
    static width = 48
    static height = 48

    constructor({ position, image }) {
        this.position = position
        this.image = image
        this.width = 48
        this.height = 48
    }

    draw() {
        // c.fillStyle = 'rgba(0, 0, 255, 0.5)' // Wyświetl mushroomZones
        c.fillStyle = 'rgba(0, 0, 255, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    drawMushroom() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.image.width,
            this.image.height
        )
    }
}