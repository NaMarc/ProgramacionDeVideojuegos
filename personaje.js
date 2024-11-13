class Personaje extends Objeto{
    constructor(x, y, juego, elementos, eventos) { 
        super(x, y, juego);

        this.elementos = elementos; 
        this.velocidadRebote = 10; 
        this.eventos = eventos; 

        this.vidas = 3;
        this.velocidad = 5;

        this.estadoAtacando = false;

        this.teclas = {};
        this.luzActivada = false;

        this.cargarSpriteAnimado("Assets/Player/texture.json", "Idle");

        /*this.sprite = new PIXI.Sprite(this.textura);
        this.contenedorObjeto.addChild(this.sprite);
        this.sprite.scale.set(4);
        this.sprite.anchor.set(0.5, 1);*/
       

        //LUZ
        this.luz = PIXI.Sprite.from('./Assets/luz.png'); //Modificar imagen
        this.contenedorObjeto.addChild(this.luz);
        this.luz.anchor.set(0.5);

        this.luz.width = window.innerWidth;
        this.luz.height = window.innerHeight;

        this.luz.alpha = 0.15;

        this.luz.visible = false;

        
        this.setupInput();
        this.actualizar();
    }

    setupInput() {
        window.addEventListener('keydown', (event) => {
            
            this.teclas[event.key] = true;
            if (event.key === ' ') {
                this.luzActivada = !this.luzActivada;
                this.luz.visible = this.luzActivada;
            }
            if (event.key.toLowerCase() === 'f') { //**Cambiar 
                console.log('atacando');
                this.estadoAtacando = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            this.teclas[event.key] = false;

            if (event.key.toLowerCase() === 'f') {
                this.estadoAtacando = false;
            }
        });
    }

    
    mover() {
        if (!this.spriteCargado) return;  // Si el sprite no está cargado, no hacemos nada

        // Definir las animaciones y teclas asociadas
        const animaciones = {
            'w': 'CaminaArriba',
            's': 'CaminaAbajo',
            'a': 'CaminaIzq',
            'd': 'CaminaDer',
            'f': 'Ataca'
        };

        let animacionDeseada = '';

        // Comprobar las teclas presionadas para determinar la animación
        for (const tecla of ['w', 's', 'a', 'd', 'f']) {
            if (this.teclas[tecla] && this.esMovimientoValido(tecla)) {
                animacionDeseada = animaciones[tecla];
                break; // Solo una animación debe ejecutarse
            }
        }

        // Si no hay movimiento ni ataque, usar la animación "Idle"
        if (!animacionDeseada) {
            if (this.estadoAtacando) {
                animacionDeseada = 'Ataca';  // Si está atacando, usa la animación de ataque
            } else {
                animacionDeseada = 'Idle';  // De lo contrario, la animación "Idle"
            }
        }

        // Cambiar la animación si es necesario
        if (this.animacionActual !== animacionDeseada) {
            this.cargarSpriteAnimado("Assets/Player/texture.json", animacionDeseada); // Invoca el método de la clase padre
        }

        // Realizar el movimiento si no está en animación de ataque
        if (animacionDeseada !== 'Ataca') {
            if (animacionDeseada === 'CaminaArriba' && this.sprite.y > 0) {
                this.sprite.y -= this.velocidad;
            } else if (animacionDeseada === 'CaminaAbajo' && this.sprite.y < this.juego.app.renderer.height - this.sprite.height) {
                this.sprite.y += this.velocidad;
            } else if (animacionDeseada === 'CaminaIzq' && this.sprite.x > 0) {
                this.sprite.x -= this.velocidad;
            } else if (animacionDeseada === 'CaminaDer' && this.sprite.x < this.juego.app.renderer.width - this.sprite.width) {
                this.sprite.x += this.velocidad;
            }
        }

        // Actualizar posición de la luz si existe
        if (this.luz) {
            this.luz.x = this.sprite.x;
            this.luz.y = this.sprite.y;
        }
    }
    // Verificar si el movimiento es válido (dentro de los límites)
    esMovimientoValido(tecla) {
        if (tecla === 'w' && this.sprite.y > 0) return true;
        if (tecla === 's' && this.sprite.y < this.juego.app.renderer.height) return true;
        if (tecla === 'a' && this.sprite.x > 0) return true;
        if (tecla === 'd' && this.sprite.x < this.juego.app.renderer.width) return true;
        return false;
    }

   

    // Colision con otro 
    verificarColision(objeto) {
        const dx = objeto.x - this.sprite.x;
        const dy = objeto.y - this.sprite.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < 25 + 5) { // Radio del personaje + radio del círculo
            this.rebotar(dx, dy); 
            return true;
        }
        return false;
    }

     //Método para rebotar 
    rebotar(dx, dy) {
        const distancia = Math.sqrt(dx * dx + dy * dy);
        const normalX = dx / distancia;
        const normalY = dy / distancia;
    
        // Desplazamiento progresivo
        this.sprite.x += normalX * this.velocidadRebote;
        this.sprite.y += normalY * this.velocidadRebote;
    
        // Reducir la velocidad de rebote
        this.velocidadRebote *= 0.9;
    
        // Evitar que la velocidad de rebote se haga demasiado pequeña
        if (this.velocidadRebote < 0.1) {
            this.velocidadRebote = 0;
        }
    }
    
    actualizar() {
        if (!this.listo) return;

        if (this.juego.contadorDeFrames % 4 == 1) {
            this.manejarSprites();
        }
        this.calcularYAplicarFuerzas();
        super.actualizar();
    }
    

    // VIDAS
   updateVidas() {
        if(this.vidas >= 0){
            this.vidas--;
            console.log('El personaje pierde una vida')
            this.elementos.perderVida();

            if (this.vidas === 0) {
               console.log("Fin");
               // this.eventos.mostrar();
            }
        }
   }
}






