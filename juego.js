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
        this.personaje = new Personaje(this.app, this.elementos); // Pasa la instancia de elementos

        this.contenedor.addChild(this.personaje.sprite);
        this.contenedor.addChild(this.personaje.luz);

        this.app.ticker.add(() => this.update());
    }

    update() {
        this.personaje.mover();
        this.enemigos.moverCirculos(this.personaje);
        this.enemigos.aumentarVisibilidad(this.personaje.luzActivada);
    }
   /* gameOver() {
        this.app.ticker.stop(); // Detiene el ticker de PIXI
        this.mostrarMensajeFin(); // Llama a un método para mostrar un mensaje de fin
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
