
class Enemigos {
    constructor(app, contenedor) {
        this.app = app;
        this.contenedor = contenedor;
       
        this.gruposCirculos = [];
        this.numCirculosPorGrupo = 5;
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
        const grupo = new PIXI.Container();
        for (let i = 0; i < this.numCirculosPorGrupo; i++) {
            const circulo = new PIXI.Graphics();
            circulo.beginFill(color);
            circulo.alpha = 0.15;
            circulo.drawCircle(0, 0, this.radio);
            circulo.endFill();
            circulo.x = Math.random() * this.app.renderer.width;
            circulo.y = Math.random() * this.app.renderer.height;
            circulo.colisionado = false;
            grupo.addChild(circulo);
        }
        this.gruposCirculos.push(grupo);
        this.contenedor.addChild(grupo);
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

                if (distancia > 0) {
                    const dirX = (dx / distancia) * this.velocidadCirculos;
                    const dirY = (dy / distancia) * this.velocidadCirculos;

                    circulo.x += dirX;
                    circulo.y += dirY;

                    // Verificar colisión con el personaje
                    if (distancia < this.radio + 25 && !circulo.colisionado) { // 25 es el radio del personaje
                        personaje.updateVidas(); // Resta una vida al personaje
                        circulo.colisionado = true; // Marca el círculo como colisionado
                        console.log(`Colisión detectada! Vidas restantes: ${personaje.vidas}`);
                    }
                }
            });
        });
    }
}
