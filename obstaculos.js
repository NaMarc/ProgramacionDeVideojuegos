
class Obstaculo extends Objeto{
    constructor(x, y, juego, imagenUrl) {
        super(x, y , juego)
        this.tipo = "";
       
              //Textura- imagen
              this.textura = PIXI.Texture.from(imagenUrl);
              this.sprite = new PIXI.Sprite(this.textura);
              
              // Obstáculo
              this.radio = this.sprite.width * 0.5;
              this.sprite.anchor.set(0.5, 0.82);
              // Posición aleatoria
              //this.sprite.x = Math.random() * (this.app.renderer.width - this.sprite.width);
              //this.sprite.y = Math.random() * (this.app.renderer.height - this.sprite.height);
      
              this.contenedorObjeto.addChild(this.sprite);
              this.actualizarZIndex();
      
              this.contenedorObjeto.pivot.set(this.sprite.width/2, this.sprite.height)
              this.meterEnGrid();
              //this.actualizar();
    
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


    actualizar() {
        super.actualizar();
    }

    
}
