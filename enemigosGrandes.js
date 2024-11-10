class EnemigosGrandes {
    constructor(app, contenedor) {
        this.app = app;
        this.contenedor = contenedor;
        this.enemigos = [];
        this.numEnemigos = 5; //Ampliar?
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
            enemigo.id = `enemigo_${Math.floor(Math.random() * 1000000)}_${i}`;
            console.log(`Enemigo creado con ID: ${enemigo.id}`);
            enemigo.eliminado = false;  
            this.enemigos.push(enemigo);
            this.contenedor.addChild(enemigo);
        }
    }

    mover(personaje) {
        this.enemigos.forEach((enemigo) => {

            if (enemigo.eliminado) return;

            const dx = personaje.sprite.x - enemigo.x;
            const dy = personaje.sprite.y - enemigo.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            // Persigue al personaje si la luz esta activada
            if (personaje.luzActivada && distancia < 400) { 
                const dirX = (dx / distancia) * this.velocidad;
                const dirY = (dy / distancia) * this.velocidad;

                enemigo.x += dirX;
                enemigo.y += dirY;
            }

            //Colision con el personaje 
            if (distancia < this.radio + 5) { 

                
                if (personaje.estadoAtacando) {
                    this.destruirEnemigo(enemigo);
                    console.log(`Enemigo con ID: ${enemigo.id} ha sido destruido.`);
                }

                
                let tiempoActual = Date.now();
                if (tiempoActual - enemigo.ultimoAtaque >= 1500 || !enemigo.ultimoAtaque) {
                    enemigo.ultimoAtaque = tiempoActual;
                    personaje.updateVidas(); 
                }
            }
        });
    }

    destruirEnemigo(enemigo) {
        if (!enemigo.eliminado) {
            // getChildIndex para verificar si el enemigo está en el contenedor
            const index = this.contenedor.getChildIndex(enemigo);
            if (index !== -1) {
                this.contenedor.removeChild(enemigo);
                console.log(`Enemigo con ID: ${enemigo.id} ha sido eliminado.`);
            }

            enemigo.eliminado = true;

            // Eliminarlo del array de enemigos
            const indexEnemigo = this.enemigos.indexOf(enemigo);
            if (indexEnemigo > -1) {
                this.enemigos.splice(indexEnemigo, 1);
            }
        }
    }
}






