// Listas de opciones
const bodyParts = ["Labios", "Cuello", "Pechos", "Nalgas", "Muslos", "Orejas"];
const actions = ["Besar", "Lamer", "Morder", "Acariciar", "Chupar", "Apretar"];
const positions = ["Misionero", "Doggy Style", "Vaquera", "69", "De pie", "Cucharita"];
const places = ["Sofá", "Cocina", "Ducha", "Mesa", "Cama", "Suelo"];

let mode = "erotic"; // Modo inicial: partes del cuerpo y acciones

document.getElementById("rollButton").addEventListener("click", () => {
    rollDiceAnimation(() => {
        if (mode === "erotic") {
            document.getElementById("dice1").innerText = getRandomItem(bodyParts);
            document.getElementById("dice2").innerText = getRandomItem(actions);
            mode = "position";
        } else {
            document.getElementById("dice1").innerText = getRandomItem(positions);
            document.getElementById("dice2").innerText = getRandomItem(places);
            mode = "erotic";
        }
    });
});

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Simulación de animación al lanzar los dados
function rollDiceAnimation(callback) {
    let dice1 = document.getElementById("dice1");
    let dice2 = document.getElementById("dice2");
    
    let diceSymbols = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    let counter = 0;
    let interval = setInterval(() => {
        dice1.innerText = diceSymbols[Math.floor(Math.random() * diceSymbols.length)];
        dice2.innerText = diceSymbols[Math.floor(Math.random() * diceSymbols.length)];
        counter++;
        if (counter > 10) {
            clearInterval(interval);
            callback();
        }
    }, 100);
}