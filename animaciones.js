class animacion {
    constructor(objeto) {
        this.objeto = objeto;

        // Cargar el spritesheet con el cargador de PixiJS
        PIXI.Loader.shared
            .add("Idle", "./Assets/texturePlayer.JSON") // El archivo JSON que define el spritesheet
            .load(setup);  // Una vez que se cargue, llamamos a la función setup

        // Esta es la función que se llama cuando se cargan todos los recursos
        function setup() {
            // Crear un contenedor para la escena (opcional, puedes usar el Stage directamente)
            this.container = objeto.con
            const renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x1099bb });
            document.body.appendChild(renderer.view);

            // Crear un AnimatedSprite a


            cargarSpritesheet(textura) {
                this.textura = new PIXI.AnimatedSprite(spritesheet.animacion['Idle']);
                this.textura = this.PIXI.sprite
                this.sprite.position.set(x, y);
                this.sprite.anchor.set(0.5);
                this.sprite.play();
            }

            reproducirAnimacion(nombre) {
                if (this.sprite.textures !== spritesheet.animacion[nombre]) {
                    this.sprite.textures = spritesheet.animacion[nombre];
                    this.sprite.play();
                }
            }

            animacionMueve(direccion) {
                const { izquierda, derecha, arriba, abajo } = direccion;

                if (izquierda) { this.reproducirAnimacion('CaminarIzq'); }
                else if (derecha) { this.reproducirAnimacion('CaminarDer'); }
                else if (arriba) { this.reproducirAnimacion('CaminarArriba'); }
                else if (abajo) { this.reproducirAnimacion('CaminarAbajo'); }
                else this.reproducirAnimacion('Idle');
            }

            animacionDeAtaque(direccion) {

                const { izquierda, derecha, abajo, arriba } = direccion;

                if (izquierda) { this.reproducirAnimacion('AtacaIzq'); }
                else if (derecha) { this.reproducirAnimacion('AtacaDer'); }
                else if (arriba) { this.reproducirAnimacion('AtacaArriba'); }
                else this.reproducirAnimacion('AtacaAbajo');
            }
        }
    }
}