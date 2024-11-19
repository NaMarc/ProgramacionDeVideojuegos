
class Obstaculo extends Objeto{
    constructor(x, y, juego, imagenUrl) {
        super(x, y , juego)
        this.tipo = "";
       
        this.textura = PIXI.Texture.from(imagenUrl);
        this.sprite = new PIXI.Sprite(this.textura);
      
        this.radio = 30; 
        this.sprite.width = this.radio * 6; 
        this.sprite.height = this.radio * 8; 

        this.contenedorObjeto.addChild(this.sprite);

        this.contenedorObjeto.pivot.set(this.sprite.width/2, this.sprite.height)
    
    }

    actualizar() {
        super.actualizar();
    }

    
}
