const generatePassword = document.getElementById('generatePassword');
const generatedPassword = document.getElementById('generatedPassword');

generatePassword.addEventListener('click', function() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    generatedPassword.textContent = `Contraseña generada: ${password}`;
});
