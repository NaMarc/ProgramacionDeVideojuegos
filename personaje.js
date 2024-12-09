
class Personaje extends Objeto{
    constructor(x, y, juego,velMax, elementos, eventos) { 
        super(x, y, velMax, juego);

        this.velocidadMax = velMax;

        this.elementos = elementos;  
        this.eventos = eventos; 

        this.vidas = 300;
        this.velocidad = 5;
        /*this.velocidad = new PIXI.Point(0.005 , 0.005);
        this.velMax= velMax;
        this.velMaxCuadrada = velMax **2;*/
 
        this.estadoAtacando = false;
       
        this.teclas = {};
        this.luzActivada = false;

        this.focusActivado = false;

        this.perdioVida = false;

        this.cargarSpriteAnimado("Assets/Player/texture.json", "Idle");
        this.nuevaLuz();

        this.agregarLuz();
       
        this.setupInput();
        //this.actualizar();

        this.ataqueEnCurso = false;
        this.tiempoDeAtaque = 0.05;  
        this.tiempoAtaqueRestante = 0;
    }

    nuevaLuz() {
        const radius = 500; 
        const blurSize = 10; 
    
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
        this.focus.alpha = 0.5;  

        //  Eventos del teclado
        this.juego.app.stage.interactive = true;  

        window.addEventListener('keydown', (event) => {
            if (event.key === ' ') {  
                this.focusActivado = !this.focusActivado;  
                this.focus.alpha = this.focusActivado ? 1 : 0.2;

                this.luzActivada = !this.luzActivada;  
                this.luz.alpha = this.luzActivada ? 0.5 : 0.1;

            }
        });

    }
    

   agregarLuz(){
        this.luz = PIXI.Sprite.from('./Assets/luz108.png');  
        this.contenedorObjeto.addChild(this.luz);
        this.luz.anchor.set(0.5);
        this.luz.scale.set(4);

        this.luz.alpha = 0.5;

        this.luz.visible = true;
       
    }

    actualizarLuz(){
        if (this.luz) {
            this.luz.x = this.contenedorObjeto.x;
            this.luz.y = this.contenedorObjeto.y;
    }}
    
 
    setupInput() {
        // minusculas
        window.addEventListener('keydown', (event) => {
            const tecla = event.key.toLowerCase(); 
            this.teclas[tecla] = true; 
        
            // f para ataque
            if (tecla === 'f' && !this.ataqueEnCurso) {
                this.estadoAtacando = true;
                this.ataqueEnCurso = true; 
                this.tiempoAtaqueRestante = this.tiempoDeAtaque; 
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
            if (this.ataqueEnCurso) {
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
        if (this.ataqueEnCurso) {
            this.tiempoAtaqueRestante -= this.juego.app.ticker.deltaTime / 1000;  
            if (this.tiempoAtaqueRestante <= 0) {
                this.ataqueEnCurso = false;  
                this.estadoAtacando = false; 
            }
        }
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
       // this.calcularYAplicarFuerzas();
      
        // if (!this.listo) return;
        this.mover(); 
        this.verificarEstadoDeSalud(); 
      
        if (this.juego.contadorDeFrames % 4 == 1) {
           this.actualizarLuz(); //Posicion  
           
        }
        //Actualiza la luz nueva
        if (this.focus) {
            this.focus.x = this.contenedorObjeto.x - this.focus.width / 2;  
            this.focus.y = this.contenedorObjeto.y - this.focus.height / 2;  
        }
        
        
        super.actualizar();    
    }

 

   calcularYAplicarFuerzas() {
    //
    let fuerzas = new PIXI.Point(0, 0);

    const repulsionAObstaculos = this.repelerObstaculos();
    if (repulsionAObstaculos) {
    
      fuerzas.x += repulsionAObstaculos.x;
      fuerzas.y += repulsionAObstaculos.y;
    }

    const bordes = this.ajustarPorBordes();
    fuerzas.x += bordes.x;
    fuerzas.y += bordes.y;
    this.fuerzas = fuerzas;
    this.aplicarFuerza(fuerzas);
  }

  aplicarFuerza(fuerza) {
    if (!fuerza) return;
    this.velocidad.x += fuerza.x;
    this.velocidad.y += fuerza.y;
   

    // Limitar la velocidad máxima
    const velocidadCuadrada = this.velocidad.x **2 + this.velocidad.y **2;
    if (velocidadCuadrada > this.velMaxCuadrada) {
      const magnitud = Math.sqrt(velocidadCuadrada);
      this.velocidad.x = (this.velocidad.x / magnitud) * this.velMax;
      this.velocidad.y = (this.velocidad.y / magnitud) * this.velMax;
    }
  }

 /*verificarEstadoDeSalud() {  
    if (this.vidas === 200 && !this.perdioVida) {
        this.juego.elementos.perderVida();
        this.perdioVida = true;  
    }else if (this.vidas === 100 && !this.perdioVida) {
        this.juego.elementos.perderVida();
        this.perdioVida = true;  
    }else  if (this.vidas === 0 && !this.perdioVida) {
        this.juego.elementos.perderVida();
        this.juego.condicionDeDerrota();
        //this.perdioVida = true;  
    }
    this.perdioVida = false; 
 } */
    verificarEstadoDeSalud() {
        if (!this.perdioVida) {
            if (this.vidas === 200) {
                this.juego.elementos.perderVida();
                this.perdioVida = true;  
            } else if (this.vidas === 100) {
                this.juego.elementos.perderVida();
                this.perdioVida = true;  
            } else if (this.vidas === 0) {
                this.juego.elementos.perderVida();
                this.juego.condicionDeDerrota();
                this.perdioVida = true;  
            }
        } else {
            if (this.vidas !== 200 && this.vidas !== 100 && this.vidas !== 0) {
                this.perdioVida = false;
            }
        }
    }
    

}






