// 📜 Listas de opciones
const bodyParts = ["Labios", "Cuello", "Pechos", "Nalgas", "Muslos", "Orejas"];
const actions = ["Besar", "Lamer", "Morder", "Acariciar", "Chupar", "Apretar"];
const positions = ["Misionero", "Doggy Style", "Vaquera", "69", "De pie", "Cucharita"];
const places = ["Sofá", "Cocina", "Ducha", "Mesa", "Cama", "Suelo"];

let mode = "erotic"; // 🔥 Modo inicial: partes del cuerpo + acción

const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const rollButton = document.getElementById("rollButton");
const modeButton = document.getElementById("modeButton");

// Función para obtener un elemento aleatorio de un array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 🎲 Lanzar los dados con animación
rollButton.addEventListener("click", () => {
    dice1.classList.add("shake");
    dice2.classList.add("shake");

    setTimeout(() => {
        if (mode === "erotic") {
            dice1.innerText = getRandomItem(bodyParts);
            dice2.innerText = getRandomItem(actions);
        } else {
            dice1.innerText = getRandomItem(positions);
            dice2.innerText = getRandomItem(places);
        }
        dice1.classList.remove("shake");
        dice2.classList.remove("shake");
    }, 600);
});

// 🔄 Cambiar entre modos
modeButton.addEventListener("click", () => {
    mode = (mode === "erotic") ? "position" : "erotic";
    modeButton.innerText = mode === "erotic" ? "🔄 Cambiar a Posturas + Lugar" : "🔄 Cambiar a Partes + Acción";
});