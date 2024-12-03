class Objeto{
    constructor(x, y, juego){
        this.id = randomID(8);
        this.juego = juego;
        this.grid = juego.grid;
        this.app = juego.app;
        this.contenedorObjeto = new PIXI.Container();
        this.contenedorObjeto.name = "contenedorObjeto"
        this.juego.contenedor.addChild(this.contenedorObjeto);
        this.listo = false;
        this.contenedorObjeto.x = x;
        this.contenedorObjeto.y = y;

        this.spriteCargado = false; 
        this.animacionActual = ""; 
        this.texturasCargadas = {}; 
    }

//ANIMACION
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
                this.sprite.loop = true; 
                this.sprite.play();

                this.contenedorObjeto.addChild(this.sprite);

                this.sprite.anchor.set(0.5, 1); // Ajustamos el anclaje a la parte inferior del sprite
                this.sprite.scale.set(4); // Escala del sprite
    
            }

            // Actualizar el estado de la animación actual
            this.animacionActual = animName;
            this.spriteCargado = true;

        } catch (error) {
            console.error('Error al cargar la animación:', error);
        }
    }

    obtenerVecinos() {
        let vecinos = [];
        const tamanioCelda = this.grid.tamanioCelda;
        const xIndex = Math.floor(this.contenedorObjeto.x / tamanioCelda);
        const yIndex = Math.floor(this.contenedorObjeto.y / tamanioCelda);
        const margen = 1;
        // Revisar celdas adyacentes
        for (let i = -margen; i <= margen; i++) {
            for (let j = -margen; j <= margen; j++) {
                const celda = this.grid.getCelda(xIndex + i, yIndex + j);

                if (celda) {
                    vecinos = [
                        ...vecinos,
                        ...Object.values(celda.objetosAca).filter(
                            (k) => k != this 
                        ),
                    ];
                }
            }
        }
        return vecinos;
    }

    estoyEnLaMismaCeldaQue(fulano) {
        return (
            fulano.miCeldaActual &&
            this.miCeldaActual &&
            fulano.miCeldaActual == this.miCeldaActual
        );
    }     
        
    ajustarPorBordes() {
        let fuerza = new PIXI.Point(0, 0);

        let margen = this.juego.grid.tamanioCelda * 0.5;
        let limiteDerecho = this.juego.ancho - margen;
        let limiteIzquierdo = margen;
        let limiteArriba = margen;
        let limiteAbajo = this.juego.alto - margen;

        let cuantaFuerza = 1;

        if (this.contenedorObjeto.x < limiteIzquierdo) fuerza.x = cuantaFuerza;
        if (this.contenedorObjeto.y < limiteArriba) fuerza.y = cuantaFuerza;
        if (this.contenedorObjeto.x > limiteDerecho) fuerza.x = -cuantaFuerza;
        if (this.contenedorObjeto.y > limiteAbajo) fuerza.y = -cuantaFuerza;

        return fuerza;
    }

    actualizarPosicionEnGrid() {
        this.juego.grid.update(this);
    }

    actualizarZIndex() {
        this.contenedorObjeto.zIndex = Math.floor(this.contenedorObjeto.y);
    }

    actualizar(){
        this.actualizarZIndex();
        this.actualizarPosicionEnGrid();
    }

    // render() {
    //     //this.contenedorObjeto.rotation = this.angulo;
    //     this.contenedorObjeto.x = this.x;
    //     this.contenedorObjeto.y = this.y;
    // }


}
