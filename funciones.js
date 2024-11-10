
const abecedario = "abcdefghijklmnopqrstuvwxyz";
const numeros = "123456789";
function randomID(longitud, caracteres) {
    let id = "";
    for (let i = 0; i < longitud; i++) {
        const idRandom = Math.floor(Math.random() * caracteres.length);
        id += caracteres[idRandom];
    }
    return id;
}
