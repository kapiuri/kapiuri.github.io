document.addEventListener('DOMContentLoaded', function() {
    if (typeof forge === 'undefined') {
        alert('La biblioteca Forge no se ha cargado correctamente. Por favor, revisa la consola para más detalles.');
        return;
    }

    document.getElementById('certForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const domain = document.getElementById('domain').value;
        const organization = document.getElementById('organization').value;
        const organizationalUnit = document.getElementById('organizationalUnit').value;
        const country = document.getElementById('country').value;
        const state = document.getElementById('state').value;
        const locality = document.getElementById('locality').value;
        const validityYears = parseInt(document.getElementById('validityYears').value, 10);
        const format = document.getElementById('format').value;

        if (!domain) {
            alert('Por favor, introduce un dominio.');
            return;
        }

        const pki = forge.pki;

        try {
            const keys = pki.rsa.generateKeyPair(2048);
            const privateKey = keys.privateKey;
            const publicKey = keys.publicKey;

            const cert = pki.createCertificate();
            cert.publicKey = publicKey;
            cert.serialNumber = '01';
            cert.validFrom = new Date();
            cert.validTo = new Date();
            cert.validTo.setFullYear(cert.validTo.getFullYear() + validityYears);
            cert.setSubject([
                { name: 'commonName', value: domain },
                { name: 'organizationName', value: organization },
                { name: 'organizationalUnitName', value: organizationalUnit },
                { name: 'localityName', value: locality },
                { name: 'stateOrProvinceName', value: state },
                { name: 'countryName', value: country }
            ]);
            cert.setIssuer([
                { name: 'commonName', value: domain }
            ]);
            cert.sign(privateKey);

            let certData, mimeType, fileExtension;
            if (format === 'der') {
                certData = forge.asn1.toDer(pki.certificateToAsn1(cert)).getBytes();
                mimeType = 'application/x-x509-ca-cert';
                fileExtension = 'der';
            } else if (format === 'pfx') {
                // Generar PFX (requiere claves privadas y otros datos adicionales)
                alert('Generación de PFX no implementada en este ejemplo.');
                return;
            } else if (format === 'pkcs7') {
                const p7 = pki.createCaCertificate();
                p7.certificates = [cert];
                certData = forge.pkcs7.messageToPem(p7);
                mimeType = 'application/x-pkcs7-certificates';
                fileExtension = 'p7b';
            } else if (format === 'crt') {
                certData = pki.certificateToPem(cert);
                mimeType = 'application/x-pem-file';
                fileExtension = 'crt';
            } else {
                certData = pki.certificateToPem(cert);
                mimeType = 'application/x-pem-file';
                fileExtension = 'pem';
            }

            const blob = new Blob([certData], { type: mimeType });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = url;
            downloadLink.download = `certificado.${fileExtension}`;
            downloadLink.style.display = 'block';
            downloadLink.innerHTML = `Descargar Certificado en formato ${format.toUpperCase()}`;

            document.getElementById('result').textContent = `Certificado generado para ${domain}\n\n${certData}`;
        } catch (error) {
            console.error('Error al generar el certificado:', error);
            alert('Hubo un problema al generar el certificado. Revisa la consola para más detalles.');
        }
    });
});
