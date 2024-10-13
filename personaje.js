class Personaje {
    constructor(app, elementos) { // Acepta elementos como parámetro
        this.app = app;
        this.elementos = elementos; // Guarda la instancia
        /*this.gameOver = gameOver;*/
        this.velocidadRebote = 10; //  velocidad del rebote
        
        this.vidas = 3;
        this.velocidad = 5;

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xFFFF00);
        this.sprite.drawCircle(0, 0, 25);
        this.sprite.endFill();
        this.sprite.x = 0;
        this.sprite.y = 0;

        this.luz = new PIXI.Graphics();
        this.luz.beginFill(0xFFFFFF, 0.5);
        this.luz.drawCircle(0, 0, 150);
        this.luz.endFill();
        this.luz.visible = false;

        this.teclas = {};
        this.luzActivada = false;

        this.setupInput();

    
    }

    // Presionar la luz
    setupInput() {
        window.addEventListener('keydown', (event) => {
            this.teclas[event.key] = true;
            if (event.key === ' ') {
                this.luzActivada = !this.luzActivada;
                this.luz.visible = this.luzActivada;
            }
        });

        window.addEventListener('keyup', (event) => {
            this.teclas[event.key] = false;
        });
    }

    //Movimientos al presionar teclado asdw
    mover() {
        const xAnterior = this.sprite.x;
        const yAnterior = this.sprite.y;

        if (this.teclas['w'] || this.teclas['W'] && this.sprite.y > 0) this.sprite.y -= this.velocidad;
        if (this.teclas['s'] || this.teclas['S'] && this.sprite.y < this.app.renderer.height) this.sprite.y += this.velocidad;
        if (this.teclas['a'] || this.teclas['A'] && this.sprite.x > 0) this.sprite.x -= this.velocidad;
        if (this.teclas['d'] || this.teclas['D'] && this.sprite.x < this.app.renderer.width) this.sprite.x += this.velocidad;

        if (this.sprite.x <= 0 || this.sprite.x >= this.app.renderer.width) {
            this.sprite.x = xAnterior;
        }
        if (this.sprite.y <= 0 || this.sprite.y >= this.app.renderer.height) {
            this.sprite.y = yAnterior;
        }

        this.luz.x = this.sprite.x;
        this.luz.y = this.sprite.y;
    }

    verificarColision(circulo) {
        const dx = circulo.x - this.sprite.x;
        const dy = circulo.y - this.sprite.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < 25 + 5) { // Radio del personaje + radio del círculo
            this.rebotar(dx, dy);
            return true;
        }
        return false;
    }

    rebotar(dx, dy) {
        // Calcular dirección del rebote
        const normalX = dx / Math.abs(dx);
        const normalY = dy / Math.abs(dy);

        // Mover el personaje en la dirección opuesta
        this.sprite.x -= normalX * this.velocidadRebote;
        this.sprite.y -= normalY * this.velocidadRebote;
    }



  updateVidas() {
        this.vidas--;
        this.elementos.actualizarBarraDeVidas(this.vidas); // Actualiza la barra de vidas
        if (this.vidas <= 0) {
            console.log("¡Juego terminado!");
            /*this.gameOver();*/ // Llama al método gameOver de Juego
        }
    }


}


