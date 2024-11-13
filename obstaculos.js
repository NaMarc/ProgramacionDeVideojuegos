/*Anotaciones generales: 
-Generar un rebote cuando colisiona con algun obstaculo
-
 */


class Obstaculo extends Objeto{
    constructor(x, y, juego, imagenUrl) {
        super(x, y , juego)
        this.tipo = "";
       

        //Textura- imagen
        this.textura = PIXI.Texture.from(imagenUrl);
        this.sprite = new PIXI.Sprite(this.textura);
        
        // Obstáculo
        this.radio = 30; 
        this.sprite.width = this.radio * 6; 
        this.sprite.height = this.radio * 8; 
        
        // Posición aleatoria
        //this.sprite.x = Math.random() * (this.app.renderer.width - this.sprite.width);
        //this.sprite.y = Math.random() * (this.app.renderer.height - this.sprite.height);

        this.contenedorObjeto.addChild(this.sprite);
    
        //this.actualizar();
    }


    verificarColision(personaje) {
        const dx = personaje.sprite.x - this.sprite.x;
        const dy = personaje.sprite.y - this.sprite.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        // Colision con el personaje
        if (distancia < this.radio + 25) { 
            this.generarCirculos(personaje);
            return true; // Colisióna
        }
        return false; // No hay colisión
    }

    generarCirculos(personaje) {
        for (let i = 0; i < 3; i++) { // Generar 3 círculos por colisión
            const circulo = new PIXI.Graphics();
            circulo.beginFill(0xFFA500);
            circulo.drawCircle(0, 0, 5); // Radio de 5
            circulo.endFill();
            circulo.x = this.sprite.x + Math.random() * 50 - 25;
            circulo.y = this.sprite.y + Math.random() * 50 - 25;

            // Calcular dirección opuesta al personaje
            const dx = circulo.x - personaje.sprite.x;
            const dy = circulo.y - personaje.sprite.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia > 0) {
                const dirX = (dx / distancia) * 100; // Multiplicador para velocidad
                const dirY = (dy / distancia) * 100;

                // Añadir movimiento inicial en la dirección opuesta
                circulo.x += dirX;
                circulo.y += dirY;
            }

            // Guardar la referencia del círculo para actualizar su movimiento
            this.contenedor.addChild(circulo);
            circulo.mover = (delta) => {
                this.moverCirculo(circulo, personaje);
            };
        }
    }

    moverCirculo(circulo, personaje) {
        // Lógica para mover el círculo hacia el personaje
        const dx = personaje.sprite.x - circulo.x;
        const dy = personaje.sprite.y - circulo.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia > 0) {
            const dirX = (dx / distancia) * 0.15; 
            const dirY = (dy / distancia) * 0.15;

            circulo.x += dirX;
            circulo.y += dirY;
        }
    }

    /*actualizar() {
        super.actualizar();
    }*/

    reaccionarALuz(luzActivada) {
        if (luzActivada) {
            this.sprite.alpha = 1; // Visible
        } else {
            this.sprite.alpha = 0.35; // Menos visible
        }
    }
}
