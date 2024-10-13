/*Anotaciones
 -Arreglar efecto rebote del personaje con obstaculos
 -Persecucuin de los circulos generados cuando colisiona con obstaculos
 -Generar solo una vez los circilos cuando choca
 
 -Game over
 
 -Ampliar entorno
 
 -Seguimiento de camara
 
 -Que los elementos sigan en su ubicacion
 
 */




class Elementos {
    constructor(contenedor) {
        this.contenedor = contenedor; // Contenedor donde se mostrarán los elementos
        this.temporizadorTexto = this.crearTexto('03:00', 20, 20); // Crea el temporizador
        this.barraDeVidasTexto = this.crearTexto('X X X', 600, 20); // Crea la barra de vidas
        this.tiempoRestante = 180; // Tiempo total en segundos
        
        this.iniciarTemporizador(); 
    }

    crearTexto(texto, x, y) {
        const estiloTexto = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 'white',
            align: 'center'
        });
        const textoPixi = new PIXI.Text(texto, estiloTexto);
        textoPixi.x = x; 
        textoPixi.y = y; 
        this.contenedor.addChild(textoPixi); 
        return textoPixi; 
    }

    iniciarTemporizador() {
        // Inicia un temporizador que se actualiza cada segundo
        setInterval(() => {
            if (this.tiempoRestante > 0) {
                this.tiempoRestante--;
                const minutos = Math.floor(this.tiempoRestante / 60); // Calcula minutos restantes
                const segundos = this.tiempoRestante % 60; // Calcula segundos restantes
                // Actualiza el texto del temporizador
                this.temporizadorTexto.text = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
            } else {
                console.log("¡Tiempo agotado!"); // Mensaje de tiempo agotado
            }
        }, 1000); // Actualiza cada 1000 ms (1 segundo)
    }

    actualizarBarraDeVidas(vidas) {
        this.barraDeVidasTexto.text = 'X '.repeat(vidas).trim(); // Actualiza la barra de vidas
    }
}

class Juego {
    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth * 2,
            height: window.innerHeight * 2,
            backgroundColor: 0x333333
        });
        document.body.appendChild(this.app.view);

        this.contenedor = new PIXI.Container();
        this.app.stage.addChild(this.contenedor);

        this.enemigos = new Enemigos(this.app, this.contenedor);
        this.elementos = new Elementos(this.contenedor);

        this.personaje = new Personaje(this.app, this.elementos/*, this.gameOver.bind(this)*/); // Pasa el método gameOver a personaje

        this.enemigosGrandes = new EnemigosGrandes(this.app, this.contenedor); // Agrega enemigos grandes
    
        this.obstaculos = [];
        for (let i = 0; i < 5; i++) {
            this.obstaculos.push(new Obstaculo(this.app, this.contenedor));
        } //Creacion de obstaculos

        this.contenedor.addChild(this.personaje.sprite);
        this.contenedor.addChild(this.personaje.luz);

        this.circulosGenerados = [];

        this.app.ticker.add(() => this.update());
    }

    update() {
        this.personaje.mover();
        this.enemigos.moverCirculos(this.personaje);
        this.enemigos.aumentarVisibilidad(this.personaje.luzActivada);

        this.enemigosGrandes.mover(this.personaje);


         // Verificar colisiones con obstáculos
         this.obstaculos.forEach(obstaculo => {
            if (obstaculo.verificarColision(this.personaje)) {
                console.log("Colisión con obstáculo!");
            }
            obstaculo.reaccionarALuz(this.personaje.luzActivada); // Hacer que reaccionen a la luz
            
            // Mover círculos generados y verificar colisiones con el personaje
            this.circulosGenerados.forEach(circulo => {
            circulo.mover(this.personaje); // Mueve el círculo
            this.personaje.verificarColision(circulo); // Verifica colisión con el personaje
        });
        
        });
    }
   
   /* gameOver() {
        console.log("El juego ha terminado"); //Comprueba si funciona
        this.app.ticker.stop(); // Detiene el ticker de PIXI
        this.mostrarMensajeFin(); // Muestra el mensaje de fin
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
    }*/
}

const juego = new Juego();


// Ajusta el tamaño del canvas al redimensionar la ventana
window.addEventListener('resize', () => {
    juego.app.renderer.resize(window.innerWidth, window.innerHeight); // Redimensiona el renderer
});
