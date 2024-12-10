/** */
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
            fontSize: 80,
            fill: color,
            align: 'center'
        });
        const textoPixi = new PIXI.Text(texto, estiloTexto);

        this.textoPixi = textoPixi;
        return textoPixi; 
    }
    
    mostrar() {
        if (!this.mensajeMostrado) {
            this.crearRectangulo(); 

            this.app.stage.addChild(this.textoPixi);

            this.textoPixi.visible = true;

            this.mensajeMostrado = true;
           
            this.app.ticker.add(() =>{
                this.actualizarPosicion();
                this.actualizarPosicionDelRec();
            })
        }
    }

    quitar(){
            this.app.stage.removeChild(this.textoPixi);
            this.app.stage.removeChild(this.rectangulo);
            this.mensajeMostrado = false;      
    }

    actualizarPosicion(){
        this.textoPixi.anchor.set(0.5, 0.5);

        this.textoPixi.x =  this.app.view.width / 4;
        this.textoPixi.y = this.app.view.height / 4; 
    }


    crearRectangulo(){
        this.rectangulo = new PIXI.Graphics();
        this.rectangulo.beginFill(0xFFFF99, 0.5);
        this.rectangulo.drawRect(-this.textoPixi.width / 2 - 10, -this.textoPixi.height / 2 - 10, 
        this.textoPixi.width + 20, this.textoPixi.height + 20);
        this.rectangulo.endFill();

        this.app.stage.addChild(this.rectangulo);
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
//cambiar por imagen
class Inicio extends Eventos{
    constructor(app, contenedor, personaje) {
        super(app, contenedor, personaje); 
        this.crearTexto('Insectario \n Usa WASD para moverte \n Barra de espacio para  \n prender la luz o  apagar \n F para atacar\n Presiona enter para seguir ', 'black');
    }


}

