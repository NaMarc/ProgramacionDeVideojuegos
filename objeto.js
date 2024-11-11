//Todavia no implementar

class Objeto{
    constructor(x, y, juego){
        this.juego = juego;
        this.contenedorObjeto = new PIXI.Container();
        this.contenedorObjeto.name = "contenedorObjeto"
        this.juego.contenedor.addChild(this.contenedorObjeto);

        
        
        this.id = randomID(8);

        this.contenedorObjeto.x = x;
        this.contenedorObjeto.y = y;
        //this.velocidad = { x: 0, y: 0 };
        //this.acc = { x: 0, y: 0 };
        

        
    }
    

    actualizarPosicionEnGrid() {
        this.gridX = Math.floor(this.contenedorObjeto.x / this.juego.grid.tamanioCelda);
        this.gridY = Math.floor(this.contenedorObjeto.y / this.juego.grid.tamanioCelda);

        this.miCelda = this.juego.grid.celdas[this.gridX][this.gridY];
    }

   
    
    actualizarZIndex() {
        this.contenedorObjeto.zIndex = Math.floor(this.contenedorObjeto.y);
    }
    actualizar(){
        //his.container.x += this.velocidad.x;
        //this.container.y += this.velocidad.y;
        this.actualizarPosicionEnGrid();

        this.actualizarZIndex();
        //this.actualizarLado();
       


    }


}