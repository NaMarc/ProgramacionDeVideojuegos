class Mantis extends Objeto {
    constructor(x, y, juego) {
        super(x, y , juego);

        this.juego = juego;
        this.grid = juego.grid;

        this.animacion = this.cargarSpriteAnimado("Assets/Mantis/mantis.json", "CaminaAbajo");
    }

    
}






