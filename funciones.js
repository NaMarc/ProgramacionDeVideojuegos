const caracteres = "123456789abcdefghijklmnopqrstuvwxyz";
function randomID(longitud) {
    let id = "";
    for (let i = 0; i < longitud; i++) {
        const idRandom = Math.floor(Math.random() * caracteres.length);
        id += caracteres[idRandom];
    }
    return id;
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}
