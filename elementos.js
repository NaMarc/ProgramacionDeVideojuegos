
class Elementos { 
    constructor(app, contenedor, juego) {
        this.app = app;
        this.contenedor = contenedor; 

        this.juego = juego;
        
        this.barraDeVida = new BarraDeVida(this.app, 50, 20);
        this.temporizador = new Temporalizador(this.app, 1090, 80, 60, this.juego); /**Cambiar tiempo inicial a 180 */
        this.contador = new Contador(this.app, 1099, 160 ); //Quitar? Contador de bichos muertos
        this.indicadorDeLuz = new IndicadorDeLuz(this.app, 105, 65 );
    }

    perderVida() {
        this.barraDeVida.perderCorazones(); 
    }
}


class BarraDeVida {
    constructor(app, x, y) {
        this.app = app;
        this.vidas = 3;
        this.corazones = [];

        this.corazon = PIXI.Texture.from('assets/heart1.png');
        const tamanioCorazon = 45;

        for (let i = 0; i < this.vidas; i++) {
            const corazonSprite = new PIXI.Sprite(this.corazon);
            corazonSprite.width = tamanioCorazon;
            corazonSprite.height = tamanioCorazon;
            corazonSprite.x = 120 + (i * 50); 
            corazonSprite.y = 50;
            this.corazones.push(corazonSprite);
            this.app.stage.addChild(corazonSprite); 
        }
    }

    perderCorazones() {
        if (this.vidas > 0) {
            console.log('Quita un corazon')
            const corazon = this.corazones[this.vidas - 1]; 
            this.app.stage.removeChild(corazon); 
            this.corazones.pop();
            this.vidas--; 
        }
    }
}

class Temporalizador {
    constructor(app, x, y, tiempoInicial, juego) {
        this.app = app;
        this.juego = juego;
        this.tiempoRestante = tiempoInicial;
        this.x = x;
        this.y = y;
        this.crearCirculoTimer(x, y);
        this.temporizadorTexto = this.crearTexto(x, y); 
        this.iniciarTemporizador();
        this.tiempoAgotado = false;
        //
        
        const reloj = PIXI.Sprite.from('assets/timer.png');  
        reloj.x = this.x -55;
        reloj.y = this.y -55;
        reloj.scale.set(0.85);
        this.app.stage.addChild(reloj);  
     
        
    }
    
  

    crearTexto(x, y) {
        const estiloTexto = new PIXI.TextStyle({
            fontFamily: 'Tiny5',
            fontSize: 34,
            fill: 'white',
            align: 'center'
        });
        const textoPixi = new PIXI.Text('01:00', estiloTexto);/**Volver a 03:00 */

        //Centrar en el circulo
        textoPixi.anchor.set(0.5); 
        textoPixi.x = x; 
        textoPixi.y = y; 

        this.app.stage.addChild(textoPixi); 
        return textoPixi;
    }

    iniciarTemporizador() {
        setInterval(() => {
            if (this.tiempoRestante > 0) {
                this.tiempoRestante--;
                const minutos = Math.floor(this.tiempoRestante / 60);
                const segundos = this.tiempoRestante % 60;

                this.temporizadorTexto.text = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
            } else { 
                this.tiempoAgotado = true;
            }
        }, 1000);
    }

    crearCirculoTimer(x, y) {
        const circuloTimer = new PIXI.Graphics();
        circuloTimer.beginFill(0xFFFF99); 
        circuloTimer.alpha = 0.30;
        circuloTimer.drawCircle(x , y , 50); 
        circuloTimer.endFill();
        
        this.app.stage.addChild(circuloTimer); 
    }

}



//Agregar contador de insectos muertos.
class Contador{
    constructor(app, x, y){
        this.app = app;
        this.score = 0;
        this.x = x;
        this.y = y;
        this.numerosContador = this.crearTexto(x, y); 
        //this.crearCirculoContador(x, y); 

        const mosca = PIXI.Sprite.from('assets/MM.png');  
        mosca.x = 1045;
        mosca.y = 155;
        mosca.scale.set(0.03);
        this.app.stage.addChild(mosca); 
    }

   

    crearCirculoContador(x, y){
        const circuloContador = new PIXI.Graphics();
        circuloContador.beginFill(0xD3D3D3); //gris
        circuloContador.alpha = 0.30;
        circuloContador.drawCircle(x , y , 40); 
        circuloContador.endFill();
        
        this.app.stage.addChild(circuloContador); 
    }

    crearTexto(x, y) {
        const estiloTexto = new PIXI.TextStyle({
            fontFamily: 'Tiny5',
            fontSize: 28,
            fill: 'white',
            align: 'center'
        });
        const textoPixi = new PIXI.Text('000', estiloTexto);

        //Centrar en el circulo
        textoPixi.anchor.set(0.5); 
        textoPixi.x = x; 
        textoPixi.y = y; 

        this.app.stage.addChild(textoPixi); 
        return textoPixi;
    }

   
}

//Agregar imagen de la antorcha/lampara
class IndicadorDeLuz{
    constructor(app, x, y){
        this.app = app;
        //this.crearCirculoContador(x, y);
        this.x = x;
        this.y = y;
        
        const linterna = PIXI.Sprite.from('assets/iconolinternaa.png');  
        linterna.x = 45;
        linterna.y = 35;
        linterna.scale.set(0.5);
        this.app.stage.addChild(linterna);
    }

    crearCirculoContador(x, y){
        const circuloContador = new PIXI.Graphics();
        circuloContador.beginFill(0xFFFF99); //amarillo
        circuloContador.alpha = 0.30;
        circuloContador.drawCircle(x , y , 40); 
        circuloContador.endFill();
        
        this.app.stage.addChild(circuloContador); 
    }
    
}

