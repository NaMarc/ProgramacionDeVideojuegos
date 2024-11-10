//Todavia no implementar

class Obejeto{
    constructor(x, y, juego){
        this.contenedorDeCadaObjeto = new PIXI.Container();
        this.contenedorDeCadaObjeto.name = "contenedorDeCadaObjeto"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.contenedorDeCadaObjeto.addChild(this.innerContainer);

        this.juego = juego;
        
        this.id = randomID(8);

        this.juego.contenedor.addChild(this.contenedorDeCadaObjeto);
        

        this.x = x;
        this.y = y;
        //this.velocidad = { x: 0, y: 0 };
        //this.acc = { x: 0, y: 0 };
        

        
    }
    
    actualizarPosicionEnGrid() {
        this.gridX = Math.floor(this.x / this.juego.grid.tamanioCelda);
        this.gridY = Math.floor(this.y / this.juego.grid.tamanioCelda);

        this.miCelda = this.juego.grid.celdas[this.gridX][this.gridY];
    }

   
    
    actualizarZIndex() {
        this.innerContainer.zIndex = Math.floor(this.innerContainer.y);
    }
    actualizar(){
        //his.container.x += this.velocidad.x;
        //this.container.y += this.velocidad.y;

        this.actualizarZIndex();
        //this.actualizarLado();
        this.actualizarPosicionEnGrid();
        this.contenedorDeCadaObjeto.x = this.x;
        this.contenedorDeCadaObjeto.y = this.y;

    }


}