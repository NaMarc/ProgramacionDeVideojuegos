class Celda{
    constructor(x, y, juego, tamaniocelda){
        this.x = x;
        this.y = y;
        this.juego = juego;
        this.tamaniocelda = tamaniocelda;
        
        this.objetosAca= {};

    }

    agregar(objeto){
        this.objetosAca[objeto.id] = objeto;
        objeto.miCelda = this;
    }
    sacar(objeto) {
        delete this.objetosAca[objeto.id];
    }
    
}