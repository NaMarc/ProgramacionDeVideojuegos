class Personaje extends Objeto{
    constructor(x, y, juego, elementos, eventos) { 
        super(x, y, juego);

        this.elementos = elementos; 
        this.velocidadRebote = 10; 
        this.eventos = eventos; 

        this.vidas = 3;
        this.velocidad = 5;

        this.estadoAtacando = false;

        this.sprite = new PIXI.Graphics();
        this.innerContainer.addChild(this.sprite);
        this.sprite.beginFill(0xFFFF00);
        this.sprite.drawCircle(this.x, this.y, 25);
        this.sprite.endFill();
        this.sprite.x = this.x;
        this.sprite.y = this.y;

       /* this.luz = new PIXI.Graphics();
        this.luz.beginFill(0xFFFF99, 0.15); //Amarillo
        this.luz.drawCircle(0, 0, 250);
        this.luz.endFill();
        this.luz.visible = false;*/

        //LUZ
        this.luz = PIXI.Sprite.from('./Assets/luz.png'); //Modificar imagen
        this.innerContainer.addChild(this.luz);
        this.luz.anchor.set(0.5);
        this.luz.x = this.x;
        this.luz.y = this.y;

        this.luz.width = window.innerWidth;
        this.luz.height = window.innerHeight;

        this.luz.alpha = 0.15;

        this.luz.visible = false;

        this.teclas = {};
        this.luzActivada = false;

        this.setupInput();
    }

    //
    posicionActualEnX(){
        return this.sprite.x
    }
    posicionActualEnY(){
        return this.sprite.y
    }
    // Imputs (Modificar atacar - COMPLETAR)
    setupInput() {
        window.addEventListener('keydown', (event) => {
            
            this.teclas[event.key] = true;
            if (event.key === ' ') {
                this.luzActivada = !this.luzActivada;
                this.luz.visible = this.luzActivada;
            }
            if (event.key.toLowerCase() === 'f') { //**Cambiar */
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
        const xAnterior = this.sprite.x;
        const yAnterior = this.sprite.y;
        //Mejorar
        if (this.teclas['w'] || this.teclas['W'] && this.sprite.y > 0) this.sprite.y -= this.velocidad;
        if (this.teclas['s'] || this.teclas['S'] && this.sprite.y < this.app.renderer.height) this.sprite.y += this.velocidad;
        if (this.teclas['a'] || this.teclas['A']  && this.sprite.x > 0) this.sprite.x -= this.velocidad;
        if (this.teclas['d'] || this.teclas['D'] && this.sprite.x < this.app.renderer.width) this.sprite.x += this.velocidad;

        // Restringir movimiento dentro de los límites
        if (this.sprite.x <= 0 || this.sprite.x >= this.app.renderer.width) {
            this.sprite.x = xAnterior;
           
        }
        if (this.sprite.y <= 0 || this.sprite.y >= this.app.renderer.height) {
            this.sprite.y = yAnterior;
          
        }

        // Posición de la luz
        this.luz.x = this.sprite.x;
        this.luz.y = this.sprite.y;
    }

   

    // Colision con otro 
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

     //Método para rebotar 
    /* rebotar(dx, dy) {
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
    }*/
    
    actualizar() {
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
               /* this.eventos.mostrar();*/ 
            }
        }
   }
}






