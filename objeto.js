class Objeto{
    constructor(x, y,velocidadMax, juego){
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
        //
        this.velocidad = new PIXI.Point(0, 0);
        this.velocidadMax = velocidadMax;
        this.velocidadMaxCuadrada = velocidadMax * velocidadMax;
       
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

                //this.sprite.scale.set(4); // Escala del sprite
                if (this instanceof Enemigo) {     //escala según clase
                    this.sprite.scale.set(2);
                };
                if (this instanceof Personaje) {
                    this.sprite.scale.set(4);
                };
    
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
            this.miCeldaActual &&
            fulano.miCeldaActual &&
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
//
    /*repelerObstaculos(vecinos) {
        const vecFuerza = new PIXI.Point(0, 0);
        let cant = 0;
        vecinos.forEach((cosa) => {
          if (cosa instanceof Obstaculo) {
            const distCuadrada = distanciaAlCuadrado(
              this.contenedorObjeto.x,
              this.contenedorObjeto.y,
              cosa.contenedorObjeto.x,
              cosa.contenedorObjeto.y 
            );
    
            if (distCuadrada < cosa.radio ** 2) {
              //SI ESTA A MENOS DE UNA CELDA DE DIST
              const dif = new PIXI.Point(
                this.contenedorObjeto.x - cosa.contenedorObjeto.x,
                this.contenedorObjeto.y - cosa.contenedorObjeto.y   
              );
              dif.x /= distCuadrada;
              dif.y /= distCuadrada;
              vecFuerza.x += dif.x;
              vecFuerza.y += dif.y;
              cant++;
              
            }
          }
        });
        if (cant) {
          vecFuerza.x *= 40;
          vecFuerza.y *= 40;
          // vecFuerza.x += -this.velocidad.x;
           //vecFuerza.y += -this.velocidad.y;
        }
    
        return vecFuerza;
      }*/

        repelerObstaculos(vecinos, umbralDistancia = 10000) {
            const vecFuerza = new PIXI.Point(0, 0);
            let cant = 0;
          
            //const umbralDistancia = 10000;  
      
            vecinos.forEach((cosa) => {
              if (cosa instanceof Obstaculo) {
                
                const distCuadrada = distanciaAlCuadrado(
                  this.contenedorObjeto.x,
                  this.contenedorObjeto.y,
                  cosa.contenedorObjeto.x,
                  cosa.contenedorObjeto.y
                );
          
                //console.log(`Distancia al cuadrado: ${distCuadrada}, Radio del obstáculo: ${cosa.radio}`);
          
                // Comparar con el umbral de distancia en lugar de radio al cuadrado
                if (distCuadrada < umbralDistancia) {
                  // Dirección de la repulsión
                  const dif = new PIXI.Point(
                    this.contenedorObjeto.x - cosa.contenedorObjeto.x,
                    this.contenedorObjeto.y - cosa.contenedorObjeto.y
                  );
          
                  //console.log(`Dirección de repulsión (antes de normalizar): (${dif.x}, ${dif.y})`);
          
                  // Calcula la magnitud del vector de diferencia
                  const magnitud = Math.sqrt(dif.x * dif.x + dif.y * dif.y);
          
                  // Normaliza el vector de diferencia si la magnitud es mayor que cero
                  if (magnitud !== 0) {
                    dif.x /= magnitud;
                    dif.y /= magnitud;
                  } else {
                    //console.log("Magnitud es cero, no se normaliza");
                  }
          
                  //console.log(`Dirección de repulsión (después de normalizar): (${dif.x}, ${dif.y})`);
          
                  // Aplica la fuerza de repulsión inversamente proporcional a la distancia
                  let fuerzaRepulsion = 1 / distCuadrada; // Inversamente proporcional a la distancia
          
                  // Limita la fuerza para evitar valores muy pequeños
                  fuerzaRepulsion = Math.max(fuerzaRepulsion, 0.01);  
          
                  //console.log(`Fuerza de repulsión calculada antes de multiplicar por escala: ${fuerzaRepulsion}`);
          
                  // Aumenta la fuerza de repulsión 
                  dif.x *= fuerzaRepulsion * 1000; 
                  dif.y *= fuerzaRepulsion * 1000;  
          
                  //  console.log(`Fuerza de repulsión final aplicada: (${dif.x}, ${dif.y})`);
          
                  // 
                  vecFuerza.x += dif.x;
                  vecFuerza.y += dif.y;
          
                  cant++;
                }
              }
            });

            if (cant) {
              //console.log(`Fuerza total de repulsión acumulada: (${vecFuerza.x}, ${vecFuerza.y})`);
              vecFuerza.x *= 1;  
              vecFuerza.y *= 1;  
            }
          
            //console.log(`Fuerza final de repulsión : (${vecFuerza.x}, ${vecFuerza.y})`);
          
            return vecFuerza;
          }
          
          
          
        
          
          
          
   
    actualizarPosicionEnGrid() {this.juego.grid.update(this);}

    actualizarZIndex() {this.contenedorObjeto.zIndex = Math.floor(this.contenedorObjeto.y);}

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
