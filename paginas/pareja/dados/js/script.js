// Listas de opciones
const bodyParts = ["Labios", "Cuello", "Pechos", "Nalgas", "Muslos", "Orejas"];
const actions = ["Besar", "Lamer", "Morder", "Acariciar", "Chupar", "Apretar"];
const positions = ["Misionero", "Doggy Style", "Vaquera", "69", "De pie", "Cucharita"];
const places = ["Sofá", "Cocina", "Ducha", "Mesa", "Cama", "Suelo"];

let mode = "erotic"; // Modo inicial: partes del cuerpo y acciones

document.getElementById("rollButton").addEventListener("click", () => {
    if (mode === "erotic") {
        document.getElementById("dice1").textContent = getRandomItem(positions);
        document.getElementById("dice2").textContent = getRandomItem(places);
        mode = "position";
    } else {
        document.getElementById("dice1").textContent = getRandomItem(bodyParts);
        document.getElementById("dice2").textContent = getRandomItem(actions);
        mode = "erotic";
    }
});

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}