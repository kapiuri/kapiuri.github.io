document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('passwordForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const password = document.getElementById('password').value;
        const strengthBar = document.querySelector('.strength-bar');
        const result = document.getElementById('result');
        const lengthCriteria = document.getElementById('lengthCriteria');
        const uppercaseCriteria = document.getElementById('uppercaseCriteria');
        const lowercaseCriteria = document.getElementById('lowercaseCriteria');
        const numberCriteria = document.getElementById('numberCriteria');
        const specialCharCriteria = document.getElementById('specialCharCriteria');

        const strength = evaluatePasswordStrength(password);
        result.textContent = `Seguridad: ${strength.label}`;
        strengthBar.style.width = strength.width;
        strengthBar.style.backgroundColor = strength.color;

        lengthCriteria.checked = password.length >= 8;
        uppercaseCriteria.checked = /[A-Z]/.test(password);
        lowercaseCriteria.checked = /[a-z]/.test(password);
        numberCriteria.checked = /\d/.test(password);
        specialCharCriteria.checked = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    });

    function evaluatePasswordStrength(password) {
        let strength = { label: 'Insegura', width: '0%', color: '#ff0000' };
        const lengthCriteria = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (lengthCriteria && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
            strength = { label: 'Muy Segura', width: '100%', color: '#00ff00' };
        } else if (lengthCriteria && (hasUppercase || hasLowercase) && (hasNumber || hasSpecialChar)) {
            strength = { label: 'Segura', width: '75%', color: '#ffff00' };
        } else if (lengthCriteria) {
            strength = { label: 'Poco Segura', width: '50%', color: '#ff8000' };
        }

        return strength;
    }
});
