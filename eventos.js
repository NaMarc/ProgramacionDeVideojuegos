//Cambiar ubicacion de los mensajes a donde esta el personaje

class Eventos {
    constructor(app, contenedor, personaje) {
        this.app = app;
        this.contenedor = contenedor;
        this.personaje = personaje;

        this.mensajeMostrado = false; 
        this.eventoTexto = null; 
    }

    crearTexto(texto, x, y, color) {
        const estiloTexto = new PIXI.TextStyle({
            fontFamily: 'Tiny5',
            fontSize: 90,
            fill: color,
            align: 'center'
        });
        const textoPixi = new PIXI.Text(texto, estiloTexto);
        textoPixi.x = x; 
        textoPixi.y = y; 
        textoPixi.anchor.set(0.5); 
        return textoPixi; 
    }
    
    mostrar() {
        if (!this.mensajeMostrado) {
            this.contenedor.addChild(this.eventoTexto);
            this.eventoTexto.visible = true;
            this.mensajeMostrado = true; 
            console.log('funciona');
        }
    }
}
class Win extends Eventos {
    constructor(app, contenedor) {
        super(app, contenedor); 
        this.eventoTexto = this.crearTexto('WIN', app.renderer.width / 2, app.renderer.height / 2, 'green');
        this.eventoTexto.visible = false; 
    }
}

class GameOver extends Eventos {
    constructor(app, contenedor) {
        super(app, contenedor); 
        this.eventoTexto = this.crearTexto('GAME OVER', app.renderer.width / 2, app.renderer.height / 2, 'red');
        this.eventoTexto.visible = false; 
    }
}
