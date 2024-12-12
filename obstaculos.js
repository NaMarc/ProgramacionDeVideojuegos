
class Obstaculo extends Objeto {
    constructor(x, y, juego, imagenUrl, n1, n2) {
        super(x, y, 0, juego)
        this.tipo = ["arbol", "piedra"];
        this.debug = 0;

        //Textura- imagen
        this.textura = PIXI.Texture.from(imagenUrl);
        this.sprite = new PIXI.Sprite(this.textura);

        // Obstáculo
        // this.radio = this.sprite.width * 0.5;
        this.sprite.pivot.set(n1, n2);
        //this.posicionPivot();


        this.contenedorObjeto.addChild(this.sprite);
        this.actualizarZIndex();

        //this.contenedorObjeto.pivot.set(this.sprite.width / 2, this.sprite.height);
        this.meterEnGrid();
    }

    meterEnGrid() {
        //this.actualizarPosicionEnGrid();
        //ME FIJO EL ANCHO DE ESTA PIEDRA Y LA METO EN MAS DE UNA CELDA, PARA Q LAS COLISIONES NO SEAN SOLO CON LA CELDA CENTRAL DONDE ESTA LA PIEDRA
        if (this.radio > this.juego.grid.tamanioCelda) {
            let dif = this.radio - this.juego.grid.tamanioCelda;
            let cantCeldasParaCadaLado = Math.ceil(dif / this.juego.grid.tamanioCelda);
            let miCelda = this.juego.grid.getCeldaPX(
                this.contenedorObjeto.x,
                this.contenedorObjeto.y
            );
            for (let i = 1; i <= cantCeldasParaCadaLado; i++) {
                //celda para la izq:
                let celdaIzq = this.juego.grid.getCelda(miCelda.x - i, miCelda.y);
                celdaIzq.agregar(this);
                //celda der:
                let celdaDer = this.juego.grid.getCelda(miCelda.x + i, miCelda.y);
                celdaDer.agregar(this);
            }
        }
    }


    actualizar() { super.actualizar(); }

    posicionPivot() {
        if (this.tipo === "arbol") {
            this.sprite.pivot.set(90, 200);
        }
        if (this.tipo === "piedra") {
            this.sprite.pivot.set(50, 50);
        }
    }



}
