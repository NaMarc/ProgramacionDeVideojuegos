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
            this.celdas[x] = []; 
            for (let y = 0; y < this.celdasAlto; y++) {
                this.celdas[x][y] = new Celda(x, y, this.juego/*, this.tamanioCelda*/);
            }
        }
    }
   
    getCelda(x, y) {
       // const xIndex = Math.floor(x / this.tamanioCelda);
       // const yIndex = Math.floor(y / this.tamanioCelda);

        let newx = Math.max(0, Math.min(this.celdasAncho - 1, x));
        let newy = Math.max(0, Math.min(this.celdasAlto - 1, y));
        
        return this.celdas[newx][newy];
    }

   

    agregar(objeto) {
        // Obtener la posición global del objeto (fuera del contenedor)
        //const globalPosition = objeto.contenedorObjeto.getGlobalPosition();
    
        
        let xIndex = Math.floor(objeto.contenedorObjeto.x / this.tamanioCelda);
        let yIndex = Math.floor(objeto.contenedorObjeto.y / this.tamanioCelda);
        if(objeto instanceof Personaje){
            // console.log(celda)
            // debugger
        }
    
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
        this.remover(objeto); // Eliminar el objeto de su celda actual
        this.agregar(objeto); // Volver a agregar el objeto a la celda nueva
    }
}