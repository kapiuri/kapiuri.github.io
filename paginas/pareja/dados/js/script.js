// Listas de opciones
const bodyParts = ["Labios", "Cuello", "Pechos", "Nalgas", "Muslos", "Orejas"];
const actions = ["Besar", "Lamer", "Morder", "Acariciar", "Chupar", "Apretar"];
const positions = ["Misionero", "Doggy Style", "Vaquera", "69", "De pie", "Cucharita"];
const places = ["Sofá", "Cocina", "Ducha", "Mesa", "Cama", "Suelo"];

let mode = "erotic"; // Modo inicial: partes del cuerpo y acciones

const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const rollButton = document.getElementById("rollButton");
const modeButton = document.getElementById("modeButton");

// Lanzar los dados
rollButton.addEventListener("click", () => {
    rollDiceAnimation(() => {
        if (mode === "erotic") {
            dice1.innerText = getRandomItem(bodyParts);
            dice2.innerText = getRandomItem(actions);
        } else {
            dice1.innerText = getRandomItem(positions);
            dice2.innerText = getRandomItem(places);
        }
    });
});

// Cambiar entre modos
modeButton.addEventListener("click", () => {
    mode = (mode === "erotic") ? "position" : "erotic";
    alert(`Modo cambiado a: ${mode === "erotic" ? "Partes del cuerpo + Acción" : "Postura + Lugar"}`);
});

// Función para obtener un valor aleatorio
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Animación al lanzar los dados
function rollDiceAnimation(callback) {
    dice1.classList.add("shake");
    dice2.classList.add("shake");

    setTimeout(() => {
        dice1.classList.remove("shake");
        dice2.classList.remove("shake");
        callback();
    }, 600);
}