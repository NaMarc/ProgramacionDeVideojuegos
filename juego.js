/*Anotaciones
 -Arreglar efecto rebote del personaje con obstaculos

 -Implementar asset

 -Cambiar imagenes por las definitivas

 -Colisiones

 -Maquina de estados

 -grid
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
        this.app.stage.addChild(this.contenedor);

        

        this.agregarFondo(); 
        this.iniciarElementos();
        this.iniciarEventos();

        //


        


        // Creación de obstáculos arboles (cambiar / mejorar -->)
        this.obstaculos = [];
        for (let i = 0; i < 5; i++) {
            this.obstaculos.push(new Obstaculo(this.app, this.contenedor, 'assets/arbol3.png'));
        } 
        for (let i = 0; i < 5; i++) {
            this.obstaculos.push(new Obstaculo(this.app, this.contenedor, 'assets/arbusto.png'));
        } 
       

        this.contenedor.addChild(this.personaje.sprite);
        this.contenedor.addChild(this.personaje.luz);


        this.circulosGenerados = [];
        this.app.ticker.add(() => this.update());
    }

    agregarFondo() {
        const fondoTextura = PIXI.Texture.from('Assets/Pasto1.png'); //Cambiar imagen
        const fondoSprite = new PIXI.Sprite(fondoTextura);

        // Ajustar 
        fondoSprite.width = this.app.view.width;
        fondoSprite.height = this.app.view.height;

        this.contenedor.addChildAt(fondoSprite, 0); 
    }

    iniciarElementos(){
        this.enemigos = new Enemigos(this.app, this.contenedor);
        this.elementos = new Elementos(this.app, this.contenedor, this);
        this.personaje = new Personaje(this.app, this.elementos, this.eventos); 
        this.enemigosGrandes = new EnemigosGrandes(this.app, this.contenedor);
    }

    iniciarEventos(){
        this.eventos = new Eventos(this.app, this.contenedor);
        this.win = new Win(this.app, this.contenedor);
        this.gameOver = new GameOver(this.app, this.contenedor);
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
   
    update() {


        this.personaje.mover();
        this.enemigos.moverCirculos(this.personaje);
        this.enemigos.aumentarVisibilidad(this.personaje.luzActivada);
        this.enemigosGrandes.mover(this.personaje);

       
        this.condicionDeDerrota();
        this.condicionDeVictoria();

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
