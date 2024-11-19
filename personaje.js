
class Personaje extends Objeto{
    constructor(x, y, juego, elementos, eventos) { 
        super(x, y, juego);

        this.elementos = elementos;  
        this.eventos = eventos; 

        this.vidas = 3;
        this.velocidad = 5;

        this.estadoAtacando = false;
       
        this.teclas = {};
        this.luzActivada = false;

        this.focusActivado = false;

        this.cargarSpriteAnimado("Assets/Player/texture.json", "Idle");
        this.nuevaLuz();

        //this.agregarLuz();
       
        this.setupInput();
        this.actualizar();
    }

    nuevaLuz() {
        const radius = 300; 
        const blurSize = 50; 
    
        //Circulo del blur
        const circle = new PIXI.Graphics()
            .beginFill(0xff0000)
            .drawCircle(radius + blurSize, radius + blurSize, radius)
            .endFill();
    
        // Filtro
        circle.filters = [new PIXI.filters.BlurFilter(blurSize)];
    
        // Textura
        const bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
        const texture = this.juego.app.renderer.generateTexture(circle, PIXI.SCALE_MODES.NEAREST, 1, bounds);
        this.focus = new PIXI.Sprite(texture);
    
        // 
        this.juego.contenedor.addChild(this.focus);
        this.juego.contenedor.mask = this.focus;  
    
        // Posicion
        this.focus.x = this.contenedorObjeto.x;
        this.focus.y = this.contenedorObjeto.y;

        //0 a 1
        this.focus.alpha = 1;  

        //  Eventos del teclado
        this.juego.app.stage.interactive = true;  

        // 
        window.addEventListener('keydown', (event) => {
            if (event.key === 'v') {  
                this.focus.alpha = 0.2;  
                this.focusActivado = false;
            } else if (event.key === 'b') {    
                this.focus.alpha = 1;  
                this.focusActivado = true;
            }
        });



    }
    

    /*agregarLuz(){
        this.luz = PIXI.Sprite.from('./Assets/luz3232.png'); 
        this.contenedorObjeto.addChild(this.luz);
        this.luz.anchor.set(0.5, 1);
        this.luz.scale.set(4);

        this.luz.alpha = 0.5;

        this.luz.visible = false;
    }*/

    /*actualizarLuz(){
        if (this.luz) {
            this.luz.x = this.contenedorObjeto.x;
            this.luz.y = this.contenedorObjeto.y;
    }}*/
    
 
    setupInput() {
        // minusculas
        window.addEventListener('keydown', (event) => {
            const tecla = event.key.toLowerCase(); 
            this.teclas[tecla] = true; 
        
            // barra para luz
           /* if (tecla === ' ') {
                //this.luzActivada = !this.luzActivada;
                //this.luz.visible = this.luzActivada;

                this.focusActivado = !this.focusActivado;
                this.focus.visible = this.focusActivado;
            }*/
        
            // f para ataque
            if (tecla === 'f') {
                this.estadoAtacando = true;
            }
        });
        
        window.addEventListener('keyup', (event) => {
            const tecla = event.key.toLowerCase(); // mins
            this.teclas[tecla] = false; 
        
            //
            if (tecla === 'f') {
                this.estadoAtacando = false;
            }
        });
    }
        

    
    mover() {
        if (!this.spriteCargado) return;  // No hace nada si el sprite no esta cargado

        // Animaciones y teclas
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
            if (animacionDeseada === 'CaminaArriba' && this.contenedorObjeto.y > 0) {
                this.contenedorObjeto.y -= this.velocidad;
            } else if (animacionDeseada === 'CaminaAbajo' && this.contenedorObjeto.y < this.juego.app.renderer.height - this.sprite.height) {
                this.contenedorObjeto.y += this.velocidad;
            } else if (animacionDeseada === 'CaminaIzq' && this.contenedorObjeto.x > 0) {
                this.contenedorObjeto.x -= this.velocidad;
            } else if (animacionDeseada === 'CaminaDer' && this.contenedorObjeto.x < this.juego.app.renderer.width - this.sprite.width) {
                this.contenedorObjeto.x += this.velocidad;
            }
        }

        // Posicion de la luz
        /*if (this.luz) {
            this.luz.x = this.contenedorObjeto.x;
            this.luz.y = this.contenedorObjeto.y;
        }*/
    }
    // Verificar si el movimiento es válido (dentro de los límites)
    esMovimientoValido(tecla) {
        if (tecla === 'w' && this.contenedorObjeto.y > 0) return true;
        if (tecla === 's' && this.contenedorObjeto.y < this.juego.app.renderer.height) return true;
        if (tecla === 'a' && this.contenedorObjeto.x > 0) return true;
        if (tecla === 'd' && this.contenedorObjeto.x < this.juego.app.renderer.width) return true;
        return false;
    }

   
    actualizar() {
        // if (!this.listo) return;

         if (this.juego.contadorDeFrames % 4 == 1) {
           //this.actualizarNuevaLuz(); 
           this.actualizarLuz(); //Posicion 
            
        }
        //Actualiza la luz nueva
        if (this.focus) {
            this.focus.x = this.contenedorObjeto.x - this.focus.width / 2;  
            this.focus.y = this.contenedorObjeto.y - this.focus.height / 2;  
        }
        //this.calcularYAplicarFuerzas();
        
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







