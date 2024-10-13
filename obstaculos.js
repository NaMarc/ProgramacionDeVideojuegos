/*Anotaciones generales: 
-Hacer que los circulos generados hagan algo 
-Generar un rebote cuando colisiona con algun obstaculo?
-
 */


class Obstaculo {
    constructor(app, contenedor) {
        this.app = app;
        this.contenedor = contenedor;

        // Configuración del obstáculo
        this.radio = 30; // Radio del obstáculo
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0x0000FF); // Color azul para el obstáculo
        this.sprite.drawCircle(0, 0, this.radio);
        this.sprite.endFill();
        
        // Posición aleatoria
        this.sprite.x = Math.random() * this.app.renderer.width;
        this.sprite.y = Math.random() * this.app.renderer.height;

        this.contenedor.addChild(this.sprite);
    }

    verificarColision(personaje) {
        const dx = personaje.sprite.x - this.sprite.x;
        const dy = personaje.sprite.y - this.sprite.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        // Verifica si el personaje colisiona con el obstáculo
        if (distancia < this.radio + 25) { // 25 es el radio del personaje
            this.generarCirculos(personaje);
            return true; // Colisión detectada
            
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
                circulo.x += dirX ;
                circulo.y += dirY ;
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


    reaccionarALuz(luzActivada) {
        if (luzActivada) {
            this.sprite.alpha = 1; // Hacer el obstáculo más transparente
        } else {
            this.sprite.alpha = 0.05; // Restaurar opacidad
        }
    }
}
