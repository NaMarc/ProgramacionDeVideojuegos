class Tesoro extends Objeto {
    constructor(x, y, juego, imagenUrl) {
        super(x, y, 0, juego)
        this.tipo = "";
        this.grid = this.juego.grid;
        this.estaEnJuego = true;


        this.textura = PIXI.Texture.from(imagenUrl);
        this.sprite = new PIXI.Sprite(this.textura);

        //this.radio = 80;
        //this.sprite.sc

        this.contenedorObjeto.addChild(this.sprite);
        this.sprite.scale.set(0.5);

        //this.spite.pivot.set( / 2, this.sprite.height)
        //this.encontrarTesoro();
        this.actualizarZIndex();

    }

    actualizar() {
        this.encontrarTesoro()
        super.actualizar();
    }

    encontrarTesoro() {
        const distCuadrada = distanciaAlCuadrado(
            this.contenedorObjeto.x,
            this.contenedorObjeto.y,
            this.juego.personaje.contenedorObjeto.x,
            this.juego.personaje.contenedorObjeto.y
        );

        if (distCuadrada <= 200 && this.estaEnJuego) {
            //console.log('Dist:', distCuadrada)
            this.juego.grid.remover(this);
            this.contenedorObjeto.removeChild(this);
            this.contenedorObjeto.removeChild(this.sprite);
            //this.juego.tesoros.removeChild(this);
            this.juego.elementos.contadorTesoro.tesorosEncontrados();
            this.estaEnJuego = false;
        }



    }
}
