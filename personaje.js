class Personaje {
    constructor(app, elementos) { // Acepta elementos como parámetro
        this.app = app;
        this.elementos = elementos; // Guarda la instancia
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


    gameOver() {
        this.app.ticker.stop(); // Detiene el ticker de PIXI
        this.mostrarMensajeFin(); // Llama a un método para mostrar un mensaje de fin
    }

    mostrarMensajeFin() {
        const estiloTexto = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 'red',
            align: 'center'
        });

        const textoFin = new PIXI.Text('¡Juego Terminado!', estiloTexto);
        textoFin.x = this.app.renderer.width / 2 - textoFin.width / 2;
        textoFin.y = this.app.renderer.height / 2 - textoFin.height / 2;

        this.app.stage.addChild(textoFin);
    }

    updateVidas() {
        this.vidas--;
        this.elementos.actualizarBarraDeVidas(this.vidas); // Actualiza la barra de vidas
        if (this.vidas <= 0) {
            console.log("¡Juego terminado!");
            //  llamar a un método en la clase Juego para finalizar el juego
            gameOver(); //  instancia de PIXI.Application
        }
    }
}


