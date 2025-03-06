function calcularHash() {
  let archivoInput = document.getElementById("archivo");
  let tipoHash = document.getElementById("tipo-hash").value;
  let resultadoHash = document.getElementById("resultado-hash");

  if (archivoInput.files.length === 0) {
    alert("Por favor, sube un archivo.");
    return;
  }

  let archivo = archivoInput.files[0];
  let lector = new FileReader();

  lector.onload = function (event) {
    let archivoArrayBuffer = event.target.result;
    let archivoPalabras = CryptoJS.lib.WordArray.create(new Uint8Array(archivoArrayBuffer));

    let hash;
    switch (tipoHash) {
      case "MD5":
        hash = CryptoJS.MD5(archivoPalabras).toString(CryptoJS.enc.Hex);
        break;
      case "SHA-1":
        hash = CryptoJS.SHA1(archivoPalabras).toString(CryptoJS.enc.Hex);
        break;
      case "SHA-256":
        hash = CryptoJS.SHA256(archivoPalabras).toString(CryptoJS.enc.Hex);
        break;
      case "SHA-512":
        hash = CryptoJS.SHA512(archivoPalabras).toString(CryptoJS.enc.Hex);
        break;
      case "RIPEMD-160":
        hash = CryptoJS.RIPEMD160(archivoPalabras).toString(CryptoJS.enc.Hex);
        break;
      case "SHA3-256":
        hash = CryptoJS.SHA3(archivoPalabras, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
        break;
      default:
        hash = "Tipo de hash no soportado.";
    }

    resultadoHash.textContent = hash;
  };

  lector.onerror = function () {
    alert("Error al leer el archivo.");
  };

  lector.readAsArrayBuffer(archivo);
}
