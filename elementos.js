/*Por hacer 
    -indicador de luz
    -completar contador de muertos
*/

class Elementos { 
    constructor(app, contenedor, juego) {
        this.app = app;
        this.contenedor = contenedor; 

        this.juego = juego;
        
        this.barraDeVida = new BarraDeVida(this.app, 300, 20);
        this.temporizador = new Temporalizador(this.app, 1099, 80, 60, this.juego); /**Cambiar tiempo inicial a 180 */
        this.contador = new Contador(this.app, 990, 80 ); //Quitar? Contador de bichos muertos
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
            corazonSprite.x = 165 + (i * 50); 
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
        this.crearCirculoTimer(x, y);
        this.temporizadorTexto = this.crearTexto(x, y); 
        this.iniciarTemporizador();
        this.tiempoAgotado = false;
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
                console.log("¡Tiempo agotado!"); 
                this.tiempoAgotado = true;
               /* this.juego.condicionDeVictoria();*/
            }
        }, 1000);
    }

    crearCirculoTimer(x, y) {
        const circuloTimer = new PIXI.Graphics();
        circuloTimer.beginFill(0xD3D3D3); 
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
        this.numerosContador = this.crearTexto(x, y); 
        this.crearCirculoContador(x, y); 
    }

   

    crearCirculoContador(x, y){
        const circuloContador = new PIXI.Graphics();
        circuloContador.beginFill(0xD3D3D3); //gris
        circuloContador.alpha = 0.30;
        circuloContador.drawCircle(x , y , 50); 
        circuloContador.endFill();
        
        this.app.stage.addChild(circuloContador); 
    }

    crearTexto(x, y) {
        const estiloTexto = new PIXI.TextStyle({
            fontFamily: 'Tiny5',
            fontSize: 34,
            fill: 'white',
            align: 'center'
        });
        const textoPixi = new PIXI.Text('0000', estiloTexto);

        //Centrar en el circulo
        textoPixi.anchor.set(0.5); 
        textoPixi.x = x; 
        textoPixi.y = y; 

        this.app.stage.addChild(textoPixi); 
        return textoPixi;
    }

   /* incrementarContador(){
        this.score +=1;
        this.numerosContador.text = this.formatearPuntaje();
    }

    resetearContador(){
        this.score = 0;
        this.numerosContador.text = this.formatearPuntaje();

    }

    formatearPuntaje(){
        return this.score.toString().padStart(4, '0');
    }*/
}



//Agregar imagen de la antorcha
class IndicadorDeLuz{
    constructor(app, x, y){
        this.app = app;
        this.crearCirculoContador(x, y); 
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

