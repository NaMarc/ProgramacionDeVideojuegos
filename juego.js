/*Anotaciones
 -Arreglar efecto rebote del personaje con obstaculos

 -Implementar assets / Cambiar imagenes por las definitivas

 -Colisiones

 -Maquina de estados

 -Grid

 -Ajustar velocidades y numero de enemigos.
 */

class Juego {
    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth * 2,
            height: window.innerHeight * 2,
            backgroundColor: 0x006400 
        });
        document.body.appendChild(this.app.view);

        this.contenedor = new PIXI.Container();
        this.contenedor.name = "contendor"
        this.agregarFondo(); 
        this.app.stage.addChild(this.contenedor);
        this.contenedor.sortableChildren = true;

        this.contadorDeFrame = 0

        /*this.estadoFuncionando = false;*/

        this.grid = new Grid(this, 50);
        this.obstaculos = [];
        this.enemigos = [];

        this.agregarObstaculo("arbol", 20);
        this.agregarObstaculo("piedra", 10);
        this.agregarObstaculo("arbusto", 10);

        this.iniciarElementos();
        this.iniciarEventos();

        //
       

        //this.contenedor.addChild(this.personaje.sprite);
        this.contenedor.addChild(this.personaje.luz);


        this.circulosGenerados = [];
        this.app.ticker.add(() => this.update());
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
                this.obstaculos.push(new Obstaculo(Math.random() * this.ancho, Math.random() * this.alto, this, "Assets/arbol3.png"));
                //this.obstaculos.escalar(3);
            }
        }
        if (tipo === "piedra") {
            for (let i = 0; i < cantidad; i++) {
                this.obstaculos.push(new Obstaculo(Math.random() * this.ancho, Math.random() * this.alto, this, "Assets/roca1.png"));
                //this.obstaculos.escalar(0.5);
            }
        }
        if (tipo === "arbusto") {
            for (let i = 0; i < cantidad; i++) {
                this.obstaculos.push(new Obstaculo(Math.random() * this.ancho, Math.random() * this.alto, this, "assets/arbusto.png"));
                //this.obstaculos.escalar(0.5);
            }
        }


    }

    iniciarElementos(){
        this.enemigos = new Enemigos(this.app, this.contenedor);
        this.elementos = new Elementos(this.app, this.contenedor, this);
        this.personaje = new Personaje(this.app, this.elementos, this.eventos); 
        this.enemigosGrandes = new EnemigosGrandes(this.app, this.contenedor);
    }

    iniciarEventos(){
        this.eventos = new Eventos(this.app, this.contenedor, this.personaje);
        this.win = new Win(this.app, this.contenedor, this.personaje);
        this.gameOver = new GameOver(this.app, this.contenedor, this.personaje);
        


    }

    //*
    condicionDeVictoria(){
        if(this.elementos.temporizador && this.elementos.temporizador.tiempoAgotado){
            console.log('gano');
            this.win.mostrar();
            this.app.ticker.stop();
        }
    }

    condicionDeDerrota(){
        if (this.personaje.vidas === 0){
            console.log('perdio')
            this.gameOver.mostrar();
            this.app.ticker.stop();
        } 
}

    /*actualizarPosicionDelContenedor(){
        
 
    }*/
   
    update() {
        this.contadorDeFrame++;
        for (let obstaculo of this.obstaculos) {
            obstaculo.actualizar();
        }

        this.personaje.actualizar();

        this.personaje.mover();
        this.enemigos.moverCirculos(this.personaje);
        this.enemigos.aumentarVisibilidad(this.personaje.luzActivada);
        this.enemigosGrandes.mover(this.personaje);

        this.condicionDeDerrota();
        this.condicionDeVictoria();

        /*this.actualizarPosicionDelContenedor();*/


        // Verificar colisiones con obstáculos y círculos
        this.obstaculos.forEach(obstaculo => {
            if (obstaculo.verificarColision(this.personaje)) {
                console.log("Colisión con obstáculo!");
            }
            obstaculo.reaccionarALuz(this.personaje.luzActivada);
        });
    
        this.circulosGenerados.forEach(circulo => {
            circulo.mover(this.personaje);
            this.personaje.verificarColision(circulo);
        });

        // Actualizar la posición del contenedor para seguir al personaje
        this.contenedor.x = -this.personaje.sprite.x + window.innerWidth / 2;
        this.contenedor.y = -this.personaje.sprite.y + window.innerHeight / 2;


        


    
    }
}

const juego = new Juego();

// *Render 
window.addEventListener('resize', () => {
    juego.app.renderer.resize(window.innerWidth, window.innerHeight);
});
