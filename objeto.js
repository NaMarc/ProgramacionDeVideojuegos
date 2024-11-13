//Todavia no implementar

class Objeto{
    constructor(x, y, juego){
        this.juego = juego;
        this.contenedorObjeto = new PIXI.Container();
        this.contenedorObjeto.name = "contenedorObjeto"
        this.juego.contenedor.addChild(this.contenedorObjeto);

        
        
        this.id = randomID(8);

        this.x = x;
        this.y = y;
        this.velocidad = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };

        this.spriteCargado = false; // Bandera para saber si el sprite está cargado
        this.animacionActual = ""; // Para controlar la animación actual
        this.texturasCargadas = {}; // Para almacenar las texturas de las animaciones
        this.objetosVecinos();
    }

    async cargarSpriteAnimado(jsonPath, animName) {
        if (this.animacionActual === animName) return; // Evitar recargar la misma animación

        try {
            if (!this.texturasCargadas[jsonPath]) {
                // Solo cargar el JSON una vez
                let json = await PIXI.Assets.load(jsonPath);
                this.texturasCargadas[jsonPath] = json.animations; // Guardar las animaciones cargadas
            }

            if (this.sprite) {
                this.sprite.gotoAndStop(0); // Detener la animación actual
                this.sprite.textures = this.texturasCargadas[jsonPath][animName]; // Cambiar los frames de la animación
                this.sprite.play(); // Reproducir la nueva animación
            } else {
                this.sprite = new PIXI.AnimatedSprite(this.texturasCargadas[jsonPath][animName]);
                this.sprite.animationSpeed = 0.1;
                this.sprite.loop = true; // Por defecto las animaciones son cíclicas
                this.sprite.play();
                this.contenedorObjeto.addChild(this.sprite);
                this.sprite.anchor.set(0.5, 1);
                this.sprite.scale.set(4);
            }

            // Actualizar el estado de la animación actual
            this.animacionActual = animName;
            this.spriteCargado = true;

        } catch (error) {
            console.error('Error al cargar la animación:', error);
        }
    }
    objetosVecinos() {
        let vecinos = [];
        const tamanioCelda = this.juego.grid.tamanioCelda;
        const xIndex = Math.floor(this.juego.contenedor.x / tamanioCelda);
        const yIndex = Math.floor(this.juego.contenedor.y / tamanioCelda);
        const margen = 1;
        // Revisar celdas adyacentes
        for (let i = this.x - margen; i <= this.x + margen; i++) {
            for (let j = this.y - margen; j <= this.y + margen; j++) {
                const celda = this.juego.grid.getCelda(xIndex + i, yIndex + j);

                if (celda) {
                vecinos = [celda.objetosAca]
                }   
            }
        }
        return vecinos;
    }
    ajustarPorBordes() {
        let fuerza = new PIXI.Point(0, 0);

        let margen = this.juego.grid.tamanioCelda * 0.5;
        let limiteDerecho = this.juego.canvasWidth - margen;
        let limiteIzquierdo = margen;
        let limiteArriba = margen;
        let limiteAbajo = this.juego.canvasHeight - margen;

        let cuantaFuerza = 1;

        if (this.contenedorObjeto.x < limiteIzquierdo) fuerza.x = cuantaFuerza;
        if (this.contenedorObjeto.y < limiteArriba) fuerza.y = cuantaFuerza;
        if (this.contenedorObjeto.x > limiteDerecho) fuerza.x = -cuantaFuerza;
        if (this.contenedorObjeto.y > limiteAbajo) fuerza.y = -cuantaFuerza;

        // if(this.debug)console.log(fuerza)
        return fuerza;
    }


    actualizarPosicionEnGrid(){
       this.juego.grid.update(this);

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

    render() {
        //this.contenedorObjeto.rotation = this.angulo;
        this.contenedorObjeto.x = this.x;
        this.contenedorObjeto.y = this.y;
    }


}