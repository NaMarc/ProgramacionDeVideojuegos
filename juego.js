class Juego {
    constructor() {
        this.pausa = false;
        this.juegoIniciado = false;
        this.canvasWidth = window.innerWidth * 2;
        this.canvasHeight = window.innerHeight * 2;
        this.lerpSpeed = 0.1; //camara
        this.app = new PIXI.Application({
            width: this.canvasWidth,
            height: this.canvasHeight,
            // resizeTo: window,
            backgroundColor: 0x000000,
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
            volume: 0.2
        });

        this.inicio = new Inicio(this.app, this.contenedor, this.personaje);

        this.inicio.mostrar();

        this.controles();

    }

    controles() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.iniciar();
                console.log('presionado');
            }
        });
    }

    iniciar() {
        if (!this.juegoIniciado) {
            this.inicio.quitar();
            this.juegoIniciado = true;
            this.cargar();
        }
    }

    cargar() {
        this.grid = new Grid(this, 200);

        this.objetos = [];
        this.obstaculos = [];
        this.enemigo = [];
        //this.mantis = [];
        //this.tesoro = [];

        this.agregarObstaculo("arbol", 20);
        this.agregarObstaculo("piedra", 5);
        //this.agregarObstaculo("arbusto", 10);
        //this.agregarTesoros("tesoro", 3);
        this.agregarEnemigos(100);
        //this.agregarMantis(10);

        this.iniciarElementos();
        this.iniciarEventos();

        this.personaje = new Personaje(200, 200, this, this.elementos, this.eventos);

        this.ponerListeners();

        //this.update();

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
                    "Assets/arbol3.png", 90, 200));
                this.obstaculos.push(arbol);
                this.objetos.push(arbol);
            }
        }
        if (tipo === "piedra") {
            for (let i = 0; i < cantidad; i++) {
                const piedra = (new Obstaculo(Math.random() * this.canvasWidth,
                    Math.random() * this.canvasHeight,
                    this,
                    "Assets/roca2.png", 30, 25));
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
            let velocidad = Math.random() * 1.3 + 1.5;
            const m = new Mantis(
                Math.random() * this.canvasWidth,
                Math.random() * this.canvasHeight,
                velocidad,
                this
            );
            this.mantis.push(m);
            this.objetos.push(m);
        }
    }


    iniciarElementos() {
        this.elementos = new Elementos(this.app, this.contenedor, this);
    }

    iniciarEventos() {
        this.eventos = new Eventos(this.app, this.contenedor, this.personaje);
        this.win = new Win(this.app, this.contenedor, this.personaje);
        this.gameOver = new GameOver(this.app, this.contenedor, this.personaje);
    }

    condicionDeVictoria() {
        if (this.elementos.temporizador && this.elementos.temporizador.tiempoAgotado) {
            this.win.mostrar();
            this.app.ticker.stop();
        }
    }

    condicionDeDerrota() {
        if (this.personaje.vidas === 0) {
            this.gameOver.mostrar();
            setTimeout(() => {   
            this.app.ticker.stop(); 
            }, 1000);
            
        }
    }

    ponerListeners() {
        window.addEventListener("resize", () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }

    /*pausar() {
        this.pausa = !this.pausa;
    }*/

    update() {
        //if (this.pausa) return;
        this.contadorDeFrame++;

        if (this.elementos.indicadorDeLuz) {
            this.elementos.indicadorDeLuz.verificarEstado();
        } else {
            // console.error('IndicadorDeLuz no esta definido correctamente');
        }

        this.personaje.actualizar();
        // this.personaje.render()

        for (let enemigo of this.enemigo) {
            enemigo.actualizar();
            // objeto.render();

        }
        //** */
        for (let obstaculos of this.obstaculos) {
            obstaculos.actualizar();
            // objeto.render();    
        }

        //this.condicionDeDerrota();
        //this.condicionDeVictoria();

        this.actualizarCamara();
    }


    actualizarCamara() {

        // Posicion de la camara en el personaje
        const targetX = -this.personaje.contenedorObjeto.x + window.innerWidth / 2;
        const targetY = -this.personaje.contenedorObjeto.y + window.innerHeight / 2;

        //Lerp
        this.contenedor.x = lerp(this.contenedor.x, targetX, this.lerpSpeed);
        this.contenedor.y = lerp(this.contenedor.y, targetY, this.lerpSpeed);

        // Limites de la escena
        const sceneWidth = this.canvasWidth;
        const sceneHeight = this.canvasHeight;

        // Limites de la camara
        const maxX = Math.max(0, sceneWidth - window.innerWidth);
        const maxY = Math.max(0, sceneHeight - window.innerHeight);

        //No se mueve fuera de los limites
        if (this.contenedor.x > 0) this.contenedor.x = 0;
        if (this.contenedor.y > 0) this.contenedor.y = 0;
        if (this.contenedor.x < -maxX) this.contenedor.x = -maxX;
        if (this.contenedor.y < -maxY) this.contenedor.y = -maxY;
    }


}



const juego = new Juego();



