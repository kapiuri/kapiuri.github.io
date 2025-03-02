function calcularHash() {
  let texto = document.getElementById("texto").value;
  let tipoHash = document.getElementById("tipo-hash").value;
  let resultadoHash = document.getElementById("resultado-hash");

  if (!texto) {
    alert("Por favor, ingresa un texto.");
    return;
  }

  // Calcular el hash según el tipo seleccionado
  switch (tipoHash) {
    case "MD5":
      resultadoHash.textContent = md5(texto);
      break;
    case "SHA-1":
      resultadoHash.textContent = sha1(texto);
      break;
    case "SHA-256":
      resultadoHash.textContent = sha256(texto);
      break;
    case "SHA-512":
      resultadoHash.textContent = sha512(texto);
      break;
    case "RIPEMD-160":
      resultadoHash.textContent = ripemd160(texto);
      break;
    case "SHA3-256":
      resultadoHash.textContent = sha3_256(texto);
      break;
    default:
      resultadoHash.textContent = "Tipo de hash no soportado.";
      break;
  }
}

// Función MD5 utilizando la librería de JavaScript
function md5(str) {
  return CryptoJS.MD5(str).toString(CryptoJS.enc.Hex);
}

// Función SHA-1 utilizando la librería de JavaScript
function sha1(str) {
  return CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex);
}

// Función SHA-256 utilizando la librería de JavaScript
function sha256(str) {
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}

// Función SHA-512 utilizando la librería de JavaScript
function sha512(str) {
  return CryptoJS.SHA512(str).toString(CryptoJS.enc.Hex);
}

// Función RIPEMD-160 utilizando la librería de JavaScript
function ripemd160(str) {
  return CryptoJS.RIPEMD160(str).toString(CryptoJS.enc.Hex);
}

// Función SHA3-256 utilizando la librería de JavaScript
function sha3_256(str) {
  return CryptoJS.SHA3(str, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
}
