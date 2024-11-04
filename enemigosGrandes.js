class EnemigosGrandes {
    constructor(app, contenedor) {
        this.app = app;
        this.contenedor = contenedor;
        this.enemigos = [];
        this.numEnemigos = 5; 
        this.radio = 30; 
        this.velocidad = 1.5; 

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
            enemigo.vidas = 3; 
            this.enemigos.push(enemigo);
            this.contenedor.addChild(enemigo);
        }
    }



    mover(personaje) {
        this.enemigos.forEach((enemigo, index) => {
            const dx = personaje.sprite.x - enemigo.x;
            const dy = personaje.sprite.y - enemigo.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            // Persigue al personaje
            if (personaje.luzActivada && distancia < 400) { 
                const dirX = (dx / distancia) * this.velocidad;
                const dirY = (dy / distancia) * this.velocidad;

                enemigo.x += dirX;
                enemigo.y += dirY;

                // Verificar colisión con el personaje
                if (distancia < this.radio + 25) { // 
                    personaje.updateVidas(); // Resta una vida al personaje
                    /*this.atacarEnemigo(enemigo);*/ 
                }
            }

        });
    }

   /* atacarEnemigo(enemigo) {
        enemigo.vidas--; // Resta una vida al enemigo
        console.log(` Enemigo atacado. Vidas restantes: ${enemigo.vidas}`);

        // Si el enemigo muere
        if (enemigo.vidas <= 0) {
            this.destruirEnemigo(enemigo);
        }
    }*/

    destruirEnemigo(enemigo) {
        this.contenedor.removeChild(enemigo);
        
        // Elimina al enemigo del array
        const index = this.enemigos.indexOf(enemigo);
        if (index > -1) {
            this.enemigos.splice(index, 1);
        }

        console.log("¡Muerto!");
    }
}
