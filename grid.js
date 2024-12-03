class Grid{
    constructor(juego, tamanioCelda){
        this.juego = juego;
        this.app = juego.app;
        this.tamanioCelda = tamanioCelda;
        this.celdasAncho = Math.floor(this.juego.canvasWidth / this.tamanioCelda);
        this.celdasAlto = Math.floor(this.juego.canvasHeight / this.tamanioCelda);
       
        // Crear una matriz de celdas vacías
        this.celdas = [];
        for (let x = 0; x < this.celdasAncho; x++) {
            this.celdas[x] = []; 
            for (let y = 0; y < this.celdasAlto; y++) {
                this.celdas[x][y] = new Celda(x, y, this.juego, this.tamanioCelda);
            }
        }
    }

    //dentroLimite(xIndex, yIndex) {
    //    return xIndex >= 0 && xIndex < this.celdasAncho && yIndex >= 0 && yIndex < this.celdasAlto;
    //}
   
    getCelda(x, y) {
        let newx = Math.max(0, Math.min(this.celdasAncho - 1, x));
        let newy = Math.max(0, Math.min(this.celdasAlto - 1, y));
        return this.celdas[newx][newy];
       
        
    }

    agregar(objeto) {
        const xIndex = Math.floor(objeto.contenedorObjeto.x / this.tamanioCelda);
        const yIndex = Math.floor(objeto.contenedorObjeto.y / this.tamanioCelda);

        if(objeto instanceof Personaje){/*debugger*/}
        
        const celda = this.getCelda(xIndex, yIndex);
        if (!celda) return;
        celda.agregar(objeto);
        
    }   

    remover(objeto) {
        if (objeto.miCeldaActual) {
            objeto.miCeldaActual.sacar(objeto);
        }
    }

    update(objeto) {
        this.remover(objeto); 
        this.agregar(objeto); 
    }
}