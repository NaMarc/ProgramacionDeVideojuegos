//Moscas

class Enemigo extends Objeto {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.juego = juego;
        this.grid = juego.grid;
        
        // Estados del enemigo
        this.estados = { IDLE: 0, ATACAR: 1 };
        this.estado = this.estados.IDLE;

        //var animacion
        this.animacion = this.cargarSpriteAnimado("Assets/Moscas/moscas.json", "CaminaAbajo");
       
    }

  
 

 actualizar(){
  super.actualizar();
 }

   

  }

  /** //Moscas

class Enemigo extends Objeto {
  constructor(x, y, velMax, juego) {
    super(x, y, juego);
    this.juego = juego;
    this.grid = juego.grid;
    this.listo = false;
    
    this.VelMaxOriginal = velMax;
    this.velMaxEnModoHuir = velMax * 2;
    this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;

    

    this.velocidad = new PIXI.Point(0.005 , 0.005);
    this.velMax= velMax;
    this.velMaxCuadrada = velMax **2;
    this.vision = 120 + Math.floor(Math.random() * 150); //en pixels


    this.cargarSprite();
    // Estados del enemigo
    this.estados = { IDLE: 0, ATACAR: 1 };
    this.estado = this.estados.IDLE;


   // this.animacionActual =  this.cargarSpriteAnimado("Assets/Moscas/texture.json", "Idle");
    
  }

  cargarSprite() {
    this.textura = PIXI.Texture.from("Assets/moscaprueba.png");
    this.sprite = new PIXI.Sprite(this.textura);
    this.contenedorObjeto.addChild(this.sprite);
    this.sprite.scale.set(0.05);
  }

  mirarAlrededor() {
    this.vecinos = this.objetosVecinos();
    this.celdasVecinas = this.miCeldaActual.obtenerCeldasVecinas();
    this.estoyViendoAlPlayer = this.evaluarSiEstoyViendoAlPlayer();
  }

  hacerCosasSegunEstado() {
    let vecAtraccionAlPlayer,
      vecSeparacion,
      vecAlineacion,
      vecCohesion,
      bordes,
      vecRepulsionAObstaculos;

    let sumaDeVectores = new PIXI.Point(0, 0);

    //CALCULO LA FUERZA Q TRAE AL PERSONAJE PADENTRO DE LA PANTALLA DE NUEVO
    bordes = this.ajustarPorBordes();

    if (this.estado == this.estados.ATACAR) {
      //SI ESTOY VIENDO AL PLAYER, HACERLE ATRACCION
      vecAtraccionAlPlayer = this.perseguirPlayer();
      this.velMax = this.velMaxEnModoHuir;
    } else if (this.estado == this.estados.IDLE) {
      //CALCULO LOS VECTORES PARA LOS PASOS DE BOIDS, SI NO HAY TARGET
      vecAlineacion = this.alineacion(this.vecinos);
      vecCohesion = this.cohesion(this.vecinos);
       this.velocidadMax = this.VelMaxOriginal;
    }

    vecRepulsionAObstaculos = this.repelerObstaculos(this.vecinos);
    vecSeparacion = this.separacion(this.vecinos);

    //SUMO LOS VECTORES ANTES DE APLICARLOS
    sumaDeVectores.x += (vecSeparacion || {}).x || 0;
    sumaDeVectores.x += (vecAlineacion || {}).x || 0;
    sumaDeVectores.x += (vecCohesion || {}).x || 0;
    sumaDeVectores.x += (vecAtraccionAlPlayer || {}).x || 0;
    sumaDeVectores.x += (bordes || {}).x || 0;
    sumaDeVectores.x += (vecRepulsionAObstaculos || {}).x || 0;

    sumaDeVectores.y += (vecSeparacion || {}).y || 0;
    sumaDeVectores.y += (vecAlineacion || {}).y || 0;
    sumaDeVectores.y += (vecCohesion || {}).y || 0;
    sumaDeVectores.y += (vecAtraccionAlPlayer || {}).y || 0;
    sumaDeVectores.y += (bordes || {}).y || 0;
    sumaDeVectores.y += (vecRepulsionAObstaculos || {}).y || 0;

    this.aplicarFuerza(sumaDeVectores);
  }

  actualizar() { 
    
    this.vecinos = this.obtenerVecinos();
    this.ajustarPorBordes();
    if (!this.listo) return;
    if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0) {
      this.mirarAlrededor();
      this.segunDatosCambiarDeEstado();
      this.hacerCosasSegunEstado();
    }

    if ((this.juego.contadorDeFrames + this.equipoParaUpdate) % 4 == 1) {
      //CADA 4 FRAME
      //this.calcularAngulo();
      //this.contenedorObjeto.rotation = this.angulo;
      //this.ajustarSpriteSegunAngulo();
    }

    this.contenedorObjeto.x += this.velocidad.x;
    this.contenedorObjeto.y += this.velocidad.y;

    if (Math.abs(this.velocidad.x) < 0.2 && Math.abs(this.velocidad.y) < 0.2) {
      this.velocidad.x = 0;
      this.velocidad.y = 0;
    } else {
      this.velocidad.x *= 0.98;
      this.velocidad.y *= 0.98;
    }

   

    // this.velocidad.x =lerp(this.velocidad.x, this.velocidad.x+this.acc.x,0.2)
    // this.velocidad.y = lerp(this.velocidad.y, this.velocidad.y+this.acc.y,0.2)

    //this.angulo = Math.atan2(this.velocidad.y, this.velocidad.x);

    //this.evadirObstaculos();

    super.actualizar();


  }

  /*ajustarSpriteSegunAngulo() {
    if (this.angulo > 315 || this.angulo < 45) {
      this.cambiarSprite("correrLado");
    } else if (this.angulo > 135 && this.angulo < 225) {
      this.cambiarSprite("correrLado");
    } else if (this.angulo > 45 && this.angulo < 135) {
      this.cambiarSprite("correrArriba");
    } else if (this.angulo > 225 && this.angulo < 315) {
      this.cambiarSprite("correrAbajo");
    }
  }*/

  /*calcularAngulo() {
    this.angulo = (radians_to_degrees(Math.atan2(this.velocidad.x, this.velocidad.y)) - 90 + 360) % 360;
    return this.angulo;
  }

  segunDatosCambiarDeEstado() {
    if (this.estoyViendoAlPlayer) {
      this.estado = this.estados.ATACAR;
    } else {
      this.estado = this.estados.IDLE;
    }
  }

  evaluarSiEstoyViendoAlPlayer() {
    const distanciaCuadrada = distanciaAlCuadrado(
      this.contenedorObjeto.x,
      this.contenedorObjeto.y,
      this.juego.personaje.contenedorObjeto.x,
      this.juego.personaje.contenedorObjeto.y
    );

    if (distanciaCuadrada < this.vision ** 2) {
      return true;
    }
    return false;
  }

  perseguirPlayer() {
    const vecDistancia = new PIXI.Point(
      this.juego.personaje.contenedorObjeto.x - this.contenedorObjeto.x,
      this.juego.personaje.contenedorObjeto.y - this.contenedorObjeto.y
    );

    // let vecNormalizado = normalizarVector(vecDistancia.x, vecDistancia.y);

    let distCuadrada = vecDistancia.x ** 2 + vecDistancia.y ** 2;

    //HACER NEGATIVO ESTE VECTOR Y LOS ZOMBIES TE HUYEN
    vecDistancia.x = +(50 * vecDistancia.x) / distCuadrada;
    vecDistancia.y = +(50 * vecDistancia.y) / distCuadrada;
    return vecDistancia;
  }


  aplicarFuerza(fuerza) {
    if (!fuerza) return;
    // let limiteDeFuerza = 0.1;
    // //SI LA FUERZA Q LE VAMOS A APLICAR ES MUY POCA, NI LA APLICAMOS
    // if(Math.abs(fuerza.x)<limiteDeFuerza && Math.abs(fuerza.y)<limiteDeFuerza) return;
    this.velocidad.x += fuerza.x;
    this.velocidad.y += fuerza.y;

    // Limitar la velocidad máxima
    const velocidadCuadrada = this.velocidad.x **2 + this.velocidad.y **2;
    if (velocidadCuadrada > this.velMaxCuadrada) {
      const magnitud = Math.sqrt(velocidadCuadrada);
      this.velocidad.x = (this.velocidad.x / magnitud) * this.velMax;
      this.velocidad.y = (this.velocidad.y / magnitud) * this.velMax;
    }
  }

  cohesion(vecinos) {
    const vecPromedio = new PIXI.Point(0, 0);
    let total = 0;

    vecinos.forEach((enemigo) => {
      if (enemigo instanceof Enemigo) {
        vecPromedio.x += enemigo.contenedorObjeto.x;
        vecPromedio.y += enemigo.contenedorObjeto.y;
        total++;
      }
    });

    if (total > 0) {
      vecPromedio.x /= total;
      vecPromedio.y /= total;

      // Crear un vector que apunte hacia el centro de masa
      vecPromedio.x = vecPromedio.x - this.contenedorObjeto.x;
      vecPromedio.y = vecPromedio.y - this.contenedorObjeto.y;

      // // Escalar para que sea proporcional a la velocidad máxima
      vecPromedio.x *= 0.01;
      vecPromedio.y *= 0.01;
    }

    return vecPromedio;
  }

  separacion(vecinos) {
    const vecFuerza = new PIXI.Point(0, 0);

    vecinos.forEach((enemigo) => {
      if (enemigo instanceof Enemigo) {
        const distancia = distanciaAlCuadrado(
          this.contenedorObjeto.x,
          this.contenedorObjeto.y,
          enemigo.contenedorObjeto.x,
          enemigo.contenedorObjeto.y
        );

        const dif = new PIXI.Point(
          this.contenedorObjeto.x - enemigo.contenedorObjeto.x,
          this.contenedorObjeto.y - enemigo.contenedorObjeto.y
        );
        dif.x /= distancia;
        dif.y /= distancia;
        vecFuerza.x += dif.x;
        vecFuerza.y += dif.y;
      }
    });

    vecFuerza.x *= 2.3;
    vecFuerza.y *= 2.3;
    return vecFuerza;
  }


  alineacion(vecinos) {
    const vecPromedio = new PIXI.Point(0, 0);
    let total = 0;

    vecinos.forEach((enemigo) => {
      if (enemigo instanceof Enemigo) {
        vecPromedio.x += enemigo.velocidad.x;
        vecPromedio.y += enemigo.velocidad.y;
        total++;
      }
    });

    if (total > 0) {
      vecPromedio.x /= total;
      vecPromedio.y /= total;

      // Escalar para que sea proporcional a la velocidad máxima
      vecPromedio.x *= 0.2;
      vecPromedio.y *= 0.2;
    }

    return vecPromedio;
  }*/

  /*hacerQueLaVelocidadDeLaAnimacionCoincidaConLaVelocidad() {
    this.spritesAnimados[this.spriteActual].animationSpeed =
      0.07 *
      calculoDeDistanciaRapido(0, 0, this.velocidad.x, this.velocidad.y) +
      0.1;
  }
  actualizarPosicionEnGrid() {
    this.grid.update(this);
  }*/
  /*repelerObstaculos(vecinos) {
    const vecFuerza = new PIXI.Point(0, 0);
    let cant = 0;
    vecinos.forEach((obstaculo) => {
      if (obstaculo instanceof Obstaculo) {
        const distCuadrada = distanciaAlCuadrado(
          this.contenedorObjeto.x,
          this.contenedorObjeto.y,
          obstaculo.contenedorObjeto.x,
          obstaculo.contenedorObjeto.y
        );

        if (distCuadrada < obstaculo.radio ** 2) {
          //SI ESTA A MENOS DE UNA CELDA DE DIST
          const dif = new PIXI.Point(
            this.contenedorObjeto.x - obstaculo.contenedorObjeto.x,
            this.contenedorObjeto.y - obstaculo.contenedorObjeto.y
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
      // vecFuerza.y += -this.velocidad.y;
    }

    return vecFuerza;
  }

  /*aplicarFuerza(fuerza) {
    if (!fuerza) return;
    // let limiteDeFuerza = 0.1;
    // //SI LA FUERZA Q LE VAMOS A APLICAR ES MUY POCA, NI LA APLICAMOS
    // if(Math.abs(fuerza.x)<limiteDeFuerza && Math.abs(fuerza.y)<limiteDeFuerza) return;
    this.velocidad.x += fuerza.x;
    this.velocidad.y += fuerza.y;

    // Limitar la velocidad máxima
    const velocidadCuadrada =
      this.velocidad.x * this.velocidad.x + this.velocidad.y * this.velocidad.y;
    if (velocidadCuadrada > this.velMaxCuadrada) {
      const magnitud = Math.sqrt(velocidadCuadrada);
      this.velocidad.x = (this.velocidad.x / magnitud) * this.velMax;
      this.velocidad.y = (this.velocidad.y / magnitud) * this.velMax;
    }
  }*/

  /*normalizarVelocidad() {
    if (this.velocidad.x == 0 && this.velocidad.y == 0) {
      return;
    }

    let magnitud = calculoDeDistanciaRapido(
      0,
      0,
      this.velocidad.x,
      this.velocidad.y
    );

    if (magnitud == 0) return;

    this.velocidad.x /= magnitud;
    this.velocidad.y /= magnitud;

    this.velocidad.x *= this.velocidadMax;
    this.velocidad.y *= this.velocidadMax;
    if (isNaN(this.velocidad.x) || isNaN(this.velocidad.y)) {
      
    }
    
  }*/



//}