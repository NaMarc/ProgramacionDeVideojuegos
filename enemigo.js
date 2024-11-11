class Enemigo {
    constructor(app,contenedor) {
        this.app = app;
        this.contenedor = contenedor;
        
        this.gruposCirculos = [];
        this.numCirculosPorGrupo = 2;
        this.numGrupos = 5;
        this.radio = 5;
        this.velocidadCirculos = 0.25;

        this.crearGrupos();
    }

    crearGrupos() {
        const colores = [0xFFA500, 0xFF0000, 0x008000];
        colores.forEach(color => {
            for (let i = 0; i < this.numGrupos; i++) {
                this.crearGrupoCirculos(color);
            }
        });
    }

    crearGrupoCirculos(color) {
        //const grupo = new PIXI.Container();
        for (let i = 0; i < this.numCirculosPorGrupo; i++) {
            const circulo = new PIXI.Graphics();
            circulo.beginFill(color);
            circulo.alpha = 0.15;
            circulo.drawCircle(0, 0, this.radio);
            circulo.endFill();
            circulo.x = Math.random() * this.juego.app.renderer.width;
            circulo.y = Math.random() * this.juego.app.renderer.height;
            circulo.colisionado = false;
            grupo.addChild(circulo);
        }
        this.gruposCirculos.push(grupo);
        this.contenedor.addChild(this.contenedorObjeto);
    }

    aumentarVisibilidad(luzActivada) {
        const nuevaAlpha = luzActivada ? 1 : 0.15;
        this.gruposCirculos.forEach(grupo => {
            grupo.children.forEach(circulo => {
                circulo.alpha = nuevaAlpha;
            });
        });
    }

    moverCirculos(personaje) {
        this.gruposCirculos.forEach(grupo => {
            grupo.children.forEach(circulo => {
                const dx = personaje.sprite.x - circulo.x;
                const dy = personaje.sprite.y - circulo.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);

                if (distancia > 0 && !circulo.colisionado) { // Solo mover si no ha colisionado
                    const dirX = (dx / distancia) * this.velocidadCirculos;
                    const dirY = (dy / distancia) * this.velocidadCirculos;

                    circulo.x += dirX;
                    circulo.y += dirY;

                    // Verificar colisión con el personaje
                    if (distancia < this.radio + 25 ) { //Radio del personaje
                        personaje.updateVidas(); 
                        circulo.colisionado = true; 
                        console.log(`Colisióna. Vidas restantes del personaje: ${personaje.vidas}`);
                        this.eliminarCirculo(circulo, grupo); 
                    }
                }
            });
        });
    }
    
    eliminarCirculo(circulo, grupo) {
        grupo.removeChild(circulo); 
        const index = grupo.children.indexOf(circulo);
        if (index > -1) {
            grupo.children.splice(index, 1); // Elimina del array de hijos
        }
    }
}
    




