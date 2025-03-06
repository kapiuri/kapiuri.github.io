document.addEventListener('DOMContentLoaded', function() {
    if (typeof forge === 'undefined') {
        alert('La biblioteca Forge no se ha cargado correctamente. Por favor, revisa la consola para más detalles.');
        return;
    }

    // Aplicar modo oscuro si está activado en localStorage
    if (localStorage.getItem("modoOscuro") === "true") {
        document.body.classList.add("modo-oscuro");
    }

    document.getElementById('certForm').addEventListener('submit', function(event) {
        event.preventDefault();
        generarCertificado();
    });
});

function generarCertificado() {
    const domain = document.getElementById('domain').value.trim();
    const organization = document.getElementById('organization').value.trim();
    const organizationalUnit = document.getElementById('organizationalUnit').value.trim();
    const country = document.getElementById('country').value.trim();
    const state = document.getElementById('state').value.trim();
    const locality = document.getElementById('locality').value.trim();
    const validityYears = parseInt(document.getElementById('validityYears').value, 10);
    const format = document.getElementById('format').value;

    if (!domain) {
        alert('Por favor, introduce un dominio válido.');
        return;
    }

    let passphrase = prompt('Introduce una passphrase para proteger el certificado:', '');
    if (!passphrase) {
        alert('Debes introducir una passphrase para continuar.');
        return;
    }

    try {
        const pki = forge.pki;
        const keys = pki.rsa.generateKeyPair(2048);
        const privateKey = keys.privateKey;
        const publicKey = keys.publicKey;

        const cert = pki.createCertificate();
        cert.publicKey = publicKey;
        cert.serialNumber = (new Date().getTime()).toString();
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

        cert.setIssuer(cert.subject.attributes);
        cert.sign(privateKey);

        let certData, mimeType, fileExtension;
        let privateKeyPem = forge.pki.encryptRsaPrivateKey(privateKey, passphrase, { algorithm: 'aes256' });
        let certificatePem = pki.certificateToPem(cert);

        switch (format) {
            case 'der':
                certData = forge.asn1.toDer(pki.certificateToAsn1(cert)).getBytes();
                mimeType = 'application/x-x509-ca-cert';
                fileExtension = 'der';
                break;
            case 'pfx':
                const pfxAsn1 = forge.pkcs12.toPkcs12Asn1(privateKey, [cert], passphrase, { algorithm: 'aes256' });
                certData = forge.asn1.toDer(pfxAsn1).getBytes();
                mimeType = 'application/x-pkcs12';
                fileExtension = 'pfx';
                break;
            case 'pkcs7':
                const p7 = forge.pkcs7.createSignedData();
                p7.addCertificate(cert);
                certData = forge.pkcs7.messageToPem(p7);
                mimeType = 'application/x-pkcs7-certificates';
                fileExtension = 'p7b';
                break;
            case 'crt':
                certData = certificatePem;
                mimeType = 'application/x-pem-file';
                fileExtension = 'crt';
                break;
            default:
                certData = certificatePem;
                mimeType = 'application/x-pem-file';
                fileExtension = 'pem';
                break;
        }

        descargarArchivo(certData, `certificado.${fileExtension}`, mimeType);
        descargarArchivo(privateKeyPem, 'clave_privada.pem', 'application/x-pem-file');

        document.getElementById('result').textContent = `Certificado generado para ${domain}\n\n${certificatePem}`;
    } catch (error) {
        console.error('Error al generar el certificado:', error);
        alert('Hubo un problema al generar el certificado. Revisa la consola para más detalles.');
    }
}

function descargarArchivo(contenido, nombreArchivo, tipoMime) {
    const blob = new Blob([contenido], { type: tipoMime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
