class Enemigo extends Objeto {
  constructor(x, y, velMax, juego) {
    super(x, y, velMax, juego);
    this.VelMaxOriginal = velMax;
    this.velMaxEnModoHuir = velMax * 2;
    this.juego = juego;
    this.grid = juego.grid;
    this.listo = false;
    this.vida = 1;
    this.puedeAtacar = true;

    this.VelMaxOriginal = velMax;
    this.velMaxEnModoHuir = velMax * 2;
    //this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;

    this.velocidad = new PIXI.Point(0.005, 0.005);
    this.velMax = velMax;
    this.velMaxCuadrada = velMax ** 2;
    this.vision = 120 + Math.floor(Math.random() * 150);

    // Estados del enemigo
    this.estados = { IDLE: 0, ATACAR: 1 };
    this.estado = this.estados.IDLE;

    //var animacion
    this.animacion = this.cargarSpriteAnimado("Assets/Moscas/moscas.json", "CaminaAbajo");

    const debugPoint = new PIXI.Graphics();
    debugPoint.beginFill(0xff0000);
    debugPoint.drawCircle(0, 0, 5);
    debugPoint.endFill();
    this.contenedorObjeto.addChild(debugPoint);

  }

  mirarAlrededor() {
    this.vecinos = this.obtenerVecinos();
    //this.celdasVecinas = this.miCeldaActual.obtenerCeldasVecinas();
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

    this.verificarEstadoDeVida();
    this.atacar();

    this.mirarAlrededor();
    this.segunDatosCambiarDeEstado();
    this.hacerCosasSegunEstado();

    this.calcularAngulo();

    this.ajustarSpriteSegunAngulo();

    this.contenedorObjeto.x += this.velocidad.x;
    this.contenedorObjeto.y += this.velocidad.y;

    if (Math.abs(this.velocidad.x) < 0.2 && Math.abs(this.velocidad.y) < 0.2) {
      this.velocidad.x = 0;
      this.velocidad.y = 0;
    } else {
      this.velocidad.x *= 0.98;
      this.velocidad.y *= 0.98;
    }

    super.actualizar();
  }

  ajustarSpriteSegunAngulo() {
    if (this.angulo > 315 || this.angulo < 45) {
      this.animacion = this.cargarSpriteAnimado("Assets/Moscas/moscas.json", "CaminaDer");
    } else if (this.angulo > 135 && this.angulo < 225) {
      this.animacion = this.cargarSpriteAnimado("Assets/Moscas/moscas.json", "CaminaIzq");
    } else if (this.angulo > 45 && this.angulo < 135) {
      this.animacion = this.cargarSpriteAnimado("Assets/Moscas/moscas.json", "CaminaArriba");
    } else if (this.angulo > 225 && this.angulo < 315) {
      this.animacion = this.cargarSpriteAnimado("Assets/Moscas/moscas.json", "CaminaAbajo");
    }
  }

  calcularAngulo() {
    this.angulo = (radians_to_degrees(Math.atan2(this.velocidad.x, this.velocidad.y)) - 90 + 360) % 360;
    return this.angulo;
  }

  segunDatosCambiarDeEstado() {
    if (this.estoyViendoAlPlayer && this.juego.personaje.luzActivada) {
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

    vecDistancia.x = +(100 * vecDistancia.x) / distCuadrada;
    vecDistancia.y = +(100 * vecDistancia.y) / distCuadrada;
    return vecDistancia;
  }

  aplicarFuerza(fuerza) {
    if (!fuerza) return;
    this.velocidad.x += fuerza.x;
    this.velocidad.y += fuerza.y;

    // Limitar la velocidad máxima
    const velocidadCuadrada = this.velocidad.x ** 2 + this.velocidad.y ** 2;
    if (velocidadCuadrada > this.velMaxCuadrada) {
      const magnitud = Math.sqrt(velocidadCuadrada);
      this.velocidad.x = (this.velocidad.x / magnitud) * this.velMax;
      this.velocidad.y = (this.velocidad.y / magnitud) * this.velMax;
    }
  }

  cohesion(vecinos) {
    const vecPromedio = new PIXI.Point(0, 0);
    let total = 0;

    vecinos.forEach((mosquito) => {
      if (mosquito instanceof Enemigo) {
        vecPromedio.x += mosquito.contenedorObjeto.x;
        vecPromedio.y += mosquito.contenedorObjeto.y;
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

    vecinos.forEach((mosquito) => {
      if (mosquito instanceof Enemigo) {
        const distancia = distanciaAlCuadrado(
          this.contenedorObjeto.x,
          this.contenedorObjeto.y,
          mosquito.contenedorObjeto.x,
          mosquito.contenedorObjeto.y
        );

        const dif = new PIXI.Point(
          this.contenedorObjeto.x - mosquito.contenedorObjeto.x,
          this.contenedorObjeto.y - mosquito.contenedorObjeto.y
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

    vecinos.forEach((mosquito) => {
      if (mosquito instanceof Enemigo) {
        vecPromedio.x += mosquito.velocidad.x;
        vecPromedio.y += mosquito.velocidad.y;
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
  }

  recibirAtaque() {
    this.vida -= 1;
    if (this.vida <= 0) {
      this.juego.enemigo = this.juego.enemigo.filter((k) => k != this);
      this.muerteEnCurso = true;

      this.animacion = this.cargarSpriteAnimado("Assets/Sangre1/sangre_image.json", "Explosion");

      setTimeout(() => {
        this.juego.grid.remover(this);
        this.contenedorObjeto.removeChild(this);
        this.contenedorObjeto.removeChild(this.sprite);
        this.juego.elementos.contador.aumentarContador();
      }, 2000);
    }
  }


  /*verificarEstadoDeVida(){
    if(this.miCeldaActual == this.juego.personaje.miCeldaActual 
      && this.juego.personaje.estadoAtacando){
      this.recibirAtaque()
    }
  }*/

  /*atacar(){
    if(this.miCeldaActual == this.juego.personaje.miCeldaActual && this.estados.ATACAR){
      if(this.puedeAtacar){
        this.juego.personaje.vidas -= 10;
  
        this.puedeAtacar = false;

        setTimeout(() => {
          this.puedeAtacar = true;
        }, 2000);
        console.log('Es atacado. Vidas del personaje:', this.juego.personaje.vidas);

      }else {
        //console.log('todavia no puede volver a atacar')
      }
    }
  }*/

  verificarEstadoDeVida() {
    const distCuadrada = distanciaAlCuadrado(
      this.contenedorObjeto.x,
      this.contenedorObjeto.y,
      this.juego.personaje.contenedorObjeto.x,
      this.juego.personaje.contenedorObjeto.y
    );
    if (distCuadrada <= 64
      && this.juego.personaje.estadoAtacando) {
      this.recibirAtaque()
    }
  }
  atacar() {
    const distCuadrada = distanciaAlCuadrado(
      this.contenedorObjeto.x,
      this.contenedorObjeto.y,
      this.juego.personaje.contenedorObjeto.x,
      this.juego.personaje.contenedorObjeto.y
    );

    if (distCuadrada <= 64 && this.estados.ATACAR) {
      //console.log('Dist:', distCuadrada)
      if (this.puedeAtacar) {
        this.juego.personaje.vidas -= 10;

        this.puedeAtacar = false;

        setTimeout(() => {
          this.puedeAtacar = true;
        }, 2000);
        console.log('Es atacado. Vidas del personaje:', this.juego.personaje.vidas);

      } else {
        //console.log('todavia no puede volver a atacar')
      }
    }
  }

}


