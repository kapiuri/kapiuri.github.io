document.addEventListener('DOMContentLoaded', function() {
    const generatePasswordButton = document.getElementById('generatePassword');
    const generatedPasswordDiv = document.getElementById('generatedPassword');

    generatePasswordButton.addEventListener('click', function() {
        // Conjunto de caracteres permitidos para la contraseña
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";

        // Generar una contraseña de 12 caracteres
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        // Mostrar la contraseña generada en el div
        generatedPasswordDiv.textContent = `Contraseña generada: ${password}`;
    });
});
