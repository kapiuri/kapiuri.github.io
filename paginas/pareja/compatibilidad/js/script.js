// script.js
document.addEventListener('DOMContentLoaded', () => {
    const formPersona1 = document.getElementById('quiz-form-persona1');
    const formPersona2 = document.getElementById('quiz-form-persona2');
    const resultDiv = document.getElementById('result');
    
    formPersona1.addEventListener('submit', (event) => {
        event.preventDefault();
        document.getElementById('quiz-persona1').style.display = 'none';
        document.getElementById('quiz-persona2').style.display = 'block';
    });

    formPersona2.addEventListener('submit', (event) => {
        event.preventDefault();

        const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];
        let totalScorePerson1 = 0;
        let totalScorePerson2 = 0;

        questions.forEach(q => {
            const answerPerson1 = formPersona1.querySelector(`input[name="${q}_p1"]:checked`);
            const answerPerson2 = formPersona2.querySelector(`input[name="${q}_p2"]:checked`);

            if (answerPerson1) totalScorePerson1 += parseInt(answerPerson1.value, 10);
            if (answerPerson2) totalScorePerson2 += parseInt(answerPerson2.value, 10);
        });

        const totalQuestions = questions.length;
        const maxScorePerPerson = 4 * totalQuestions; // Cada pregunta tiene una puntuación máxima de 4
        const maxTotalScore = 2 * maxScorePerPerson; // Puntuación máxima combinada para dos personas

        const totalScore = totalScorePerson1 + totalScorePerson2;
        const compatibilityPercentage = ((totalScore / maxTotalScore) * 100).toFixed(2);

        let resultText = '';
        if (compatibilityPercentage <= 20) {
            resultText = 'La compatibilidad es muy baja. Hay muchas diferencias que deben abordarse.';
        } else if (compatibilityPercentage <= 40) {
            resultText = 'La compatibilidad es baja. Hay áreas en las que pueden mejorar y entenderse mejor.';
        } else if (compatibilityPercentage <= 60) {
            resultText = 'La compatibilidad es media. Hay una base sólida, pero aún queda espacio para crecimiento.';
        } else if (compatibilityPercentage <= 80) {
            resultText = 'La compatibilidad es alta. Tienen muchos puntos en común y una buena conexión.';
        } else {
            resultText = 'La compatibilidad es excelente. Parece que tienen una conexión muy fuerte y entendimiento mutuo.';
        }

        document.getElementById('quiz-persona2').style.display = 'none';
        resultDiv.textContent = `Puntuación de Compatibilidad: ${compatibilityPercentage}% - ${resultText}`;
        resultDiv.style.display = 'block';
    });
});
