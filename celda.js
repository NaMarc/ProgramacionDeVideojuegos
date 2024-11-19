/**- */
class Celda{
    constructor(x, y, juego/*, tamanioCelda*/){
        this.x = x;
        this.y = y;
        this.juego = juego;
        //this.tamanioCelda = tamanioCelda;
        
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
  
    

} /*getCeldaClave(x, y) {
        const xIndex = Math.floor(x / this.tamanioCelda);
        const yIndex = Math.floor(y / this.tamanioCelda);
        this.clave = [xIndex][yIndex];

        //let newx = Math.max(0, Math.min(this.celdasAncho - 1, xIndex));
       // let newy = Math.max(0, Math.min(this.celdasAlto - 1, yIndex));
        //return '${xIndex}, ${yIndex}';
    }*
        / /* obtenerCeldasVecinas() {
        let vecinos = [];

        const margen = 1;
        // Revisar celdas adyacentes
        for (let i = this.x - margen; i <= this.x + margen; i++) {
            for (let j = this.y - margen; j <= this.y + margen; j++) {
                const celda = this.juego.grid.getCelda(i, j);

                if (celda && celda != this) {
                    vecinos.push(celda);
                }
            }
        }
        return vecinos;
    }*/