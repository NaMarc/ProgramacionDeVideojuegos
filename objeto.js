//Todavia no implementar

class Entidad{
    constructor(x, y, spritesheet){
        this.sprite = new PIXI.AnimatedSprite(spritesheet.animacion['Idle']);
        this.sprite.position.set(x, y);
        this.sprite.anchor.set(0.5);
        this.sprite.play();
    }

    reproducirAnimacion(nombre){
        if(this.sprite.textures !== spritesheet.animacion[nombre]){
            this.sprite.textures = spritesheet.animacion[nombre];
            this.sprite.play();
        }
    }

    animacionMueve(direccion){
        const {izquierda, derecha, arriba, abajo} = direccion;

        if (izquierda){this.reproducirAnimacion('CaminarIzq');}
         else if (derecha){this.reproducirAnimacion('CaminarDer');}
         else if (arriba){this.reproducirAnimacion('CaminarArriba');}
         else if(abajo){this.reproducirAnimacion('CaminarAbajo');}
         else this.reproducirAnimacion('Idle');
    }

    animacionDeAtaque(direccion){

        const {izquierda, derecha, abajo, arriba} = direccion;

        if (izquierda){this.reproducirAnimacion('AtacaIzq');}
        else if (derecha){this.reproducirAnimacion('AtacaDer');}
        else if (arriba){this.reproducirAnimacion('AtacaArriba');}
        else this.reproducirAnimacion('AtacaAbajo');
    }

}