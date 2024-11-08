class Eventos {
    constructor(app, contenedor, personaje) {
        this.app = app;
        this.contenedor = contenedor;
        this.personaje = personaje;

        this.mensajeMostrado = false; 
        this.eventoTexto = null; 

        this.textoPixi= null;
    }

    crearTexto( texto, color) {
        const estiloTexto = new PIXI.TextStyle({
            fontFamily: 'Tiny5',
            fontSize: 90,
            fill: color,
            align: 'center'
        });
        const textoPixi = new PIXI.Text(texto, estiloTexto);
        /*textoPixi.x = x; 
        textoPixi.y = y; 
        textoPixi.anchor.set(0.5); */

        this.textoPixi = textoPixi;
        return textoPixi; 
    }
    
    mostrar() {
        if (!this.mensajeMostrado) {
            this.crearRectangulo(); 

            this.contenedor.addChild(this.textoPixi);

            this.textoPixi.visible = true;

            this.mensajeMostrado = true;
           
            this.app.ticker.add(() =>{
                this.actualizarPosicion();
                this.actualizarPosicionDelRec();
            })

        }
    
    }

    actualizarPosicion(){
        this.textoPixi.anchor.set(0.5, 0.5);

        this.textoPixi.x = this.personaje.posicionActualEnX(); 
        this.textoPixi.y = this.personaje.posicionActualEnY(); 
    }


    crearRectangulo(){
        this.rectangulo = new PIXI.Graphics();
        this.rectangulo.beginFill(0xFFFF99, 0.5);
        this.rectangulo.drawRect(-this.textoPixi.width / 2 - 10, -this.textoPixi.height / 2 - 10, 
            this.textoPixi.width + 20, this.textoPixi.height + 20);
        this.rectangulo.endFill();

        this.contenedor.addChild(this.rectangulo);
        this.textoPixi.anchor.set(0.5 , 0.5);
    }

    actualizarPosicionDelRec(){
        this.rectangulo.x = this.textoPixi.x;
        this.rectangulo.y = this.textoPixi.y;
    }
}
class Win extends Eventos {
    constructor(app, contenedor, personaje) {
        super(app, contenedor, personaje); 
        this.crearTexto('WIN', 'green');   
    }
}

class GameOver extends Eventos {
    constructor(app, contenedor, personaje) {
        super(app, contenedor, personaje); 
        this.crearTexto('GAME OVER', 'red');
    }
}

