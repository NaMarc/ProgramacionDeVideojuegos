//Moscas

class Enemigo extends Objeto {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.juego = juego;
        this.grid = juego.grid;
        
        // Estados del enemigo
        this.estados = { IDLE: 0, ATACAR: 1 };
        this.estado = this.estados.IDLE;

        //var animacion
        this.animacion = this.cargarSpriteAnimado("Assets/Moscas/moscas.json", "CaminaAbajo");
       
    }

  
 

 actualizar(){
  super.actualizar();
 }

   

  }