class Celda{
    constructor(x, y, juego, tamanioCelda){
        this.x = x;
        this.y = y;
        this.juego = juego;
        this.tamanioCelda = tamanioCelda;
        
        this.objetosAca= {};

    }
   
    agregar(objeto){
        this.objetosAca[objeto.id] = objeto;
        objeto.miCeldaActual = this;
    }

    sacar(objeto) {
        objeto.miCeldaActual = null;
        delete this.objetosAca[objeto.id];
    }

    cuantosObjetos() {
        return Object.keys(this.objetosAca).length;
    }

    obtenerCeldasVecinas() {
        let vecinos = [];

        const margen = 1;
        // Revisar celdas adyacentes
        for (let i = this.x - margen; i <= this.x + margen; i++){
            for (let j = this.y - margen; j <= this.y + margen; j++){
                const celda = this.juego.grid.getCelda(i, j);
                if (celda && celda != this){
                    vecinos.push(celda);
                }
            }
        }
        return vecinos;
    }
   
} 