class Grid{
    constructor(juego, tamanioCelda){
        this.juego = juego;
        this.app =juego.app;
        this.tamanioCelda = tamanioCelda;
        this.celdasAncho = Math.ceil(this.juego.ancho / this.tamanioCelda);
        this.celdasAlto = Math.ceil(this.juego.alto / this.tamanioCelda);

        // Crear una matriz de celdas vacías
        this.celdas = [];
        for (let x = 0; x < this.celdasAncho; x++) {
            this.celdas.push([]); 
            for (let y = 0; y < this.celdasAlto; y++) {
                this.celdas[x][y] = new Celda(x, y, this.juego, this.tamanioCelda);
            }
        }
    }
    getCeldaPX(x, y) {
        const xIndex = Math.floor(x / this.tamanioCelda);
        const yIndex = Math.floor(y / this.tamanioCelda);


        let newx = Math.max(0, Math.min(this.celdasAncho - 1, xIndex));
        let newy = Math.max(0, Math.min(this.celdasAlto - 1, yIndex));
        return this.celdas[newx][newy];
    }

    getCelda(x, y) {
        // Asegurarse de que los índices estén dentro de los límites de la matriz
        let newx = Math.max(0, Math.min(this.celdasAncho - 1, x));
        let newy = Math.max(0, Math.min(this.celdasAlto - 1, y));

        return this.celdas[newx][newy];
    }
    add(objeto) {
        const xIndex = Math.floor(objeto.innerContainer.x / this.tamanioCelda);
        const yIndex = Math.floor(objeto.innerContainer.y / this.tamanioCelda);

        const celda = this.getCelda(xIndex, yIndex);
        if (!celda) return; //console.warn("Cell not found",xIndex,yIndex);
        celda.agregar(objeto);
    }

    remove(objeto) {
        // for (let i = 0; i < this.cells.length; i++) {
        //   for (let j = 0; j < this.cells[i].length; j++) {
        //     let cell = this.cells[i][j];
        //     cell = cell.filter((k) => k != objeto);
        //   }
        // }
        if (objeto.miCelda) {
            objeto.miCelda.sacar(objeto);
        }


    }
}