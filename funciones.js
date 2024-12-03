
const caracteres = "123456789abcdefghijklmnopqrstuvwxyz";
function randomID(longitud) {
    let id = "";
    for (let i = 0; i < longitud; i++) {
        const idRandom = Math.floor(Math.random() * caracteres.length);
        id += caracteres[idRandom];
    }
    return id;
}

function distancia(objeto1, objeto2) {
    return Math.sqrt((objeto1.contenedorObjeto.x - objeto2.contenedorObjeto.x) ** 2 + (objeto1.contenedorObjeto.y - objeto2.contenedorObjeto.y) ** 2);
}

function distanciaAlCuadrado(x1, y1, x2, y2){
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
}

function calculoDeDistanciaRapido(x1, y1, x2, y2){
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    if (dx > dy) {
        return dx + 0.4 * dy;
    } else {
        return dy + 0.4 * dx;
    }

}

function normalizarVector(x, y) {
    if (x == 0 && y == 0) {
        return;
    }

    let magnitud = calculoDeDistanciaRapido(0, 0, x, y);

    if (magnitud == 0) return;

    let vec = {x, y};

    vec.x /= magnitud;
    vec.y /= magnitud;

    return vec;
}

function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}
