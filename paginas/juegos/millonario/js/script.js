// script.js

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let usedFiftyFifty = false;
let usedCallAFriend = false;
let usedAskTheAudience = false;
let usedChangeQuestion = false;

// Obtener preguntas en español
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple&lang=es');
        const data = await response.json();
        questions = data.results.map((q) => {
            const allAnswers = [...q.incorrect_answers, q.correct_answer];
            const correctIndex = allAnswers.indexOf(q.correct_answer);
            // Mezclar respuestas
            const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
            return {
                question: q.question,
                answers: shuffledAnswers,
                correct: shuffledAnswers.indexOf(q.correct_answer)
            };
        });
        startGame();
    } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        document.getElementById('question').textContent = 'Error al cargar preguntas. Inténtalo de nuevo más tarde.';
    }
}

// Iniciar el juego
function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    usedFiftyFifty = false;
    usedCallAFriend = false;
    usedAskTheAudience = false;
    usedChangeQuestion = false;
    document.getElementById('fifty-fifty').disabled = false;
    document.getElementById('call-friend').disabled = false;
    document.getElementById('ask-audience').disabled = false;
    document.getElementById('change-question').disabled = false;
    showQuestion(currentQuestionIndex);
}

// Mostrar pregunta actual
function showQuestion(index) {
    const questionElement = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.answer-button');
    const question = questions[index];

    questionElement.innerHTML = question.question;
    answerButtons.forEach((button, i) => {
        button.innerHTML = `Opción ${String.fromCharCode(65 + i)}: ${question.answers[i]}`;
    });
}

// Verificar la respuesta
function checkAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct;
    const feedbackElement = document.getElementById('feedback');

    if (selectedIndex === correctIndex) {
        feedbackElement.textContent = '¡Respuesta Correcta!';
        score += 1000; // Incrementa el puntaje (ajústalo según el nivel)
        document.getElementById('score').textContent = `Puntos: ${score}`;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
        } else {
            feedbackElement.textContent = `¡Felicidades! Has terminado el juego con ${score} puntos.`;
        }
    } else {
        feedbackElement.textContent = 'Respuesta Incorrecta. El juego se reiniciará.';
        setTimeout(() => {
            alert("El juego se reiniciará. La página se recargará.");
            location.reload(); // Recarga la página y reinicia el juego
        }, 2000); // Esperar 2 segundos antes de recargar
    }
}

// Implementación de comodines

function useFiftyFifty() {
    if (usedFiftyFifty) {
        alert("Ya has usado el comodín 50:50.");
        return;
    }

    usedFiftyFifty = true;
    document.getElementById('fifty-fifty').disabled = true;
    const correctIndex = questions[currentQuestionIndex].correct;
    const answerButtons = document.querySelectorAll('.answer-button');
    const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
    const removeIndices = [];

    // Elegir dos respuestas incorrectas al azar para eliminar
    while (removeIndices.length < 2) {
        const index = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
        if (!removeIndices.includes(index)) {
            removeIndices.push(index);
            incorrectIndices.splice(incorrectIndices.indexOf(index), 1);
        }
    }

    answerButtons.forEach((button, i) => {
        if (removeIndices.includes(i)) {
            button.style.display = 'none';
        }
    });
}

function callAFriend() {
    if (usedCallAFriend) {
        alert("Ya has usado el comodín Llamada a un Amigo.");
        return;
    }

    usedCallAFriend = true;
    document.getElementById('call-friend').disabled = true;
    // Implementa la lógica de la llamada a un amigo aquí
    alert("La llamada a un amigo está en proceso...");
}

function askTheAudience() {
    if (usedAskTheAudience) {
        alert("Ya has usado el comodín Preguntar al Público.");
        return;
    }

    usedAskTheAudience = true;
    document.getElementById('ask-audience').disabled = true;
    // Implementa la lógica de preguntar al público aquí
    alert("Preguntar al público está en proceso...");
}

function changeQuestion() {
    if (usedChangeQuestion) {
        alert("Ya has usado el comodín Sustitución de Pregunta.");
        return;
    }

    usedChangeQuestion = true;
    document.getElementById('change-question').disabled = true;
    currentQuestionIndex = Math.floor(Math.random() * questions.length);
    showQuestion(currentQuestionIndex);
}

// Inicializa el juego
fetchQuestions();
