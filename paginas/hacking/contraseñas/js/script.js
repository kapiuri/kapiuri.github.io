document.addEventListener('DOMContentLoaded', function() {
    const generatePassword = document.getElementById('generatePassword');
    const generatedPassword = document.getElementById('generatedPassword');

    generatePassword.addEventListener('click', function() {
        // Definir el conjunto de caracteres permitidos para la contraseña
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";
        
        // Generar una contraseña de 12 caracteres
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        // Mostrar la contraseña generada en el div
        generatedPassword.textContent = `Contraseña generada: ${password}`;
    });
});
