/*Anotaciones

 -Ajustar tiempo total del juego

 */

class Juego {
    constructor() {
        this.pausa = false;
        this.canvasWidth = window.innerWidth * 2;
        this.canvasHeight = window.innerHeight * 2;
        this.lerpSpeed = 0.1; //camara
        this.app = new PIXI.Application({
            width: this.canvasWidth,
            height: this.canvasHeight,
            resizeTo: window,
            backgroundColor: 0x000000  
        });
        
        document.body.appendChild(this.app.view);

        this.gridActualizacionIntervalo = 10; // Cada 10 frames
        this.contadorDeFrame = 0;

        this.contenedor = new PIXI.Container();
        this.contenedor.name = "contendor"
        this.agregarFondo(); 
        this.app.stage.addChild(this.contenedor);
        
        this.contenedor.sortableChildren = true;

        this.musica = new Howl({
            src: ['assets/mystic-forest.ogg'], 
            autoplay: true,  
            loop: true,      
            volume: 0.4     
        });

        this.grid = new Grid(this, 50);

        this.objetos = [];
        this.obstaculos = [];
        this.enemigo = [];
        //this.mantis = [];
        //this.tesoro = [];

        this.agregarObstaculo("arbol", 10);
        this.agregarObstaculo("piedra", 5);
        this.agregarObstaculo("arbusto", 10);
        //this.agregarTesoros("tesoro", 3);
        this.agregarEnemigos(50);
        //this.agregarMantis(10);

        this.iniciarElementos();
        this.iniciarEventos(); 
        
        //
        this.personaje = new Personaje(150, 150, this, this.elementos, this.eventos);
        
        this.ponerListeners();

        //this.update();

        //Mensaje de inicio

        //this.inicio.mostrar();

        //setTimeout(() => {
        //    this.inicio.quitar();
        //}, 3000);

        //this.app.ticker.add(() => this.update());
        setTimeout(() => {
            this.app.ticker.add(this.update.bind(this));
            window.__PIXI_APP__ = this.app;
        }, 100);
    }

    agregarFondo() {
        this.contenedorFondo = new PIXI.Container();
        this.textura = PIXI.Texture.from("Assets/Pasto3.png");
        this.fondoSprite = new PIXI.TilingSprite(this.textura, this.app.view.width, this.app.view.height);
        this.contenedorFondo.addChild(this.fondoSprite);
        this.contenedor.addChild(this.contenedorFondo);
    }
    agregarObstaculo(tipo, cantidad) {
        if (tipo === "arbol") {
            for (let i = 0; i < cantidad; i++) {
                const arbol = (new Obstaculo(Math.random() * this.canvasWidth, 
                Math.random() * this.canvasHeight, 
                this, 
                "Assets/arbol3.png"));
                this.obstaculos.push(arbol);//Math.random() * (this.app.renderer.width - this.sprite.width);
                this.objetos.push(arbol);
            }
        }
        if (tipo === "piedra") {
            for (let i = 0; i < cantidad; i++) {
                const piedra = (new Obstaculo(Math.random() * this.canvasWidth, 
                Math.random() * this.canvasHeight, 
                this, 
                "Assets/roca2.png"));
                this.obstaculos.push(piedra);
                this.objetos.push(piedra);
            }
        }
        if (tipo === "arbusto") {
            for (let i = 0; i < cantidad; i++) {
                const arbusto = (new Obstaculo(Math.random() * this.canvasWidth,
                Math.random() * this.canvasHeight,
                this,
                "Assets/arbusto.png"));
                this.obstaculos.push(arbusto);
                this.objetos.push(arbusto);
            }
        }

    }
   
    
   /* agregarTesoros(tipo, cantidad){
        if (tipo === "tesoro") {
            for (let i = 0; i < cantidad; i++) {
                const tesoro = (new Tesoro(Math.random() * this.ancho, Math.random() * this.alto, this, "Assets/tesoro.png"));
                this.tesoro.push(tesoro);
                this.objetos.push(tesoro);
            }
        }
    }*/

    agregarEnemigos(cant) {
        for (let i = 0; i < cant; i++) {
            let velocidad = Math.random() * 1.3 + 1.5;
            const mosquito = new Enemigo(
                Math.random() * this.canvasWidth,
                Math.random() * this.canvasHeight,
                velocidad,
                this
            ); 
            this.enemigo.push(mosquito); 
            this.objetos.push(mosquito);
        }
    }

    agregarMantis(cant) {
        for (let i = 0; i < cant; i++) {
           // let velocidad = Math.random() * 1.3 + 1.5;
            const m = new Mantis(
                Math.random() * this.ancho,
                Math.random() * this.alto,
               // velocidad,
                this
            ); 
            this.mantis.push(m); 
            this.objetos.push(m);

        }
    }

        

    iniciarElementos(){
        this.elementos = new Elementos(this.app, this.contenedor, this); 
    }

    iniciarEventos(){
        this.eventos = new Eventos(this.app, this.contenedor, this.personaje);
        this.inicio = new Inicio(this.app, this.contenedor, this.personaje);
        this.win = new Win(this.app, this.contenedor, this.personaje);
        this.gameOver = new GameOver(this.app, this.contenedor, this.personaje);
    }

    condicionDeVictoria(){
        if(this.elementos.temporizador && this.elementos.temporizador.tiempoAgotado){
            this.win.mostrar();
            this.app.ticker.stop();
        }
    }

    condicionDeDerrota(){
        if (this.personaje.vidas === 0){
            this.gameOver.mostrar();
            this.app.ticker.stop();
        } 
    }

    ponerListeners(){
        window.addEventListener("resize", () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }

    pausar() {
        this.pausa = !this.pausa;
    }

    update() {
        if (this.pausa) return;
        this.contadorDeFrame++;

       // for (let objeto of this.objetos) {
       //     this.objeto.actualizar();
            // objeto.render();    
       // }
        
        //FALTABA HACERLE UPDATE AL PERSONAJE
        this.personaje.actualizar();
        // this.personaje.render()

       for (let enemigo of this.enemigo) {
            enemigo.actualizar();
            // objeto.render();

        }
       
        this.condicionDeDerrota();
        this.condicionDeVictoria();

        this.actualizarCamara();    
    }

    
    actualizarCamara() {
        // Posicion de la camara
        const targetX = -this.personaje.contenedorObjeto.x + window.innerWidth / 2;
        const targetY = -this.personaje.contenedorObjeto.y + window.innerHeight / 2;
    
        // LERP (suvizar movimiento de camara)
        this.contenedor.x = lerp(this.contenedor.x, targetX, this.lerpSpeed);
        this.contenedor.y = lerp(this.contenedor.y, targetY, this.lerpSpeed);
    
        // Bordes
        if (this.contenedor.x > 0) this.contenedor.x = 0;
        if (this.contenedor.y > 0) this.contenedor.y = 0;
    
        // Limitar el movimiento en el eje X e Y para que no salga de la escena
        const maxX = Math.max(0, this.personaje.contenedorObjeto.x - window.innerWidth + this.personaje.contenedorObjeto.width);
        const maxY = Math.max(0, this.personaje.contenedorObjeto.y - window.innerHeight + this.personaje.contenedorObjeto.height);
    
        if (this.contenedor.x < -maxX) this.contenedor.x = -maxX;
        if (this.contenedor.y < -maxY) this.contenedor.y = -maxY;
    }
    
}



const juego = new Juego();



