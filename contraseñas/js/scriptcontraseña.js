document.getElementById('generate').addEventListener('click', function() {
    const length = parseInt(document.getElementById('length').value);
    const includeLower = document.getElementById('includeLower').checked;
    const includeUpper = document.getElementById('includeUpper').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    document.getElementById('password').value = generatePassword(length, includeLower, includeUpper, includeNumbers, includeSymbols);
});

function generatePassword(length, includeLower, includeUpper, includeNumbers, includeSymbols) {
    let charset = '';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!#$%^&*()_+[]{}|;:\'",.<>?';

    if (charset === '') {
        return 'Seleccione al menos un tipo de carácter';
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
