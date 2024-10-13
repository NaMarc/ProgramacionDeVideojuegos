class EnemigosGrandes {
    constructor(app, contenedor) {
        this.app = app;
        this.contenedor = contenedor;
        this.enemigos = [];
        this.numEnemigos = 5; // Número de enemigos grandes
        this.radio = 30; // Radio de los enemigos grandes
        this.velocidad = 1.5; // Velocidad de persecución

        this.crearEnemigos();
    }

    crearEnemigos() {
        for (let i = 0; i < this.numEnemigos; i++) {
            const enemigo = new PIXI.Graphics();
            enemigo.beginFill(0xFF0000);
            enemigo.drawCircle(0, 0, this.radio);
            enemigo.endFill();
            enemigo.x = Math.random() * this.app.renderer.width;
            enemigo.y = Math.random() * this.app.renderer.height;
            this.enemigos.push(enemigo);
            this.contenedor.addChild(enemigo);
        }
    }

    mover(personaje) {
        this.enemigos.forEach(enemigo => {
            const dx = personaje.sprite.x - enemigo.x;
            const dy = personaje.sprite.y - enemigo.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            // Persigue al personaje si la luz está activada y está dentro de un rango
            if (personaje.luzActivada && distancia < 300) { // Rango de persecución
                const dirX = (dx / distancia) * this.velocidad;
                const dirY = (dy / distancia) * this.velocidad;

                enemigo.x += dirX;
                enemigo.y += dirY;

                // Verificar colisión con el personaje
                if (distancia < this.radio + 25) { // 25 es el radio del personaje
                    personaje.updateVidas(); // Resta una vida al personaje
                    console.log("¡Colisión con enemigo grande!");
                }
            }
        });
    }
}
