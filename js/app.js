import { initViewer, setBodyColor, setBodyFinish, setWheelStyle, loadModelFile, resetDemoModel, setCameraView } from "./viewer3d.js";
import { vehicles } from "./vehicles.js";

const $ = (id) => document.getElementById(id);
const vehicleSelect = $("vehicleSelect");
const toast = $("toast");
let currentConfig = { vehicleId: vehicles[0].id, color: "#d6d9dd", finish: "0.28", wheel: "5" };

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}
function setStatus(message) { $("statusText").textContent = message.toUpperCase(); }
function colorName(hex) {
  const names = {"#d6d9dd":"PLATA","#c51f32":"ROJO","#111820":"NEGRO","#174b79":"AZUL","#e5e0d3":"MARFIL","#526b55":"VERDE"};
  return names[hex.toLowerCase()] || "PERSONALIZADO";
}
function updateColor(hex) {
  currentConfig.color = hex;
  setBodyColor(hex);
  $("customColor").value = hex;
  $("colorValue").textContent = hex.toUpperCase();
  $("footerColor").textContent = `${colorName(hex)} ${$("finishSelect").selectedOptions[0].text.toUpperCase()}`;
  document.querySelectorAll(".swatch").forEach(el => el.classList.toggle("selected", el.dataset.color.toLowerCase() === hex.toLowerCase()));
}
function selectVehicle(id) {
  const v = vehicles.find(item => item.id === id) || vehicles[0];
  currentConfig.vehicleId = v.id;
  $("vehicleTitle").innerHTML = `${v.name} <span>${v.year}</span>`;
  setStatus("Vehículo seleccionado");
}
vehicles.forEach(v => {
  const option = document.createElement("option");
  option.value = v.id; option.textContent = `${v.brand} ${v.name} (${v.year})`;
  vehicleSelect.append(option);
});
vehicleSelect.addEventListener("change", () => { selectVehicle(vehicleSelect.value); notify("Vehículo seleccionado. El modelo visual es una demo."); });

document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(t => { t.classList.toggle("active", t === tab); t.setAttribute("aria-selected", String(t === tab)); });
  ["paint","wheels","model"].forEach(name => $(name+"Panel").classList.toggle("hidden", name !== tab.dataset.tab));
}));
document.querySelectorAll(".swatch").forEach(swatch => swatch.addEventListener("click", () => updateColor(swatch.dataset.color)));
$("customColor").addEventListener("input", e => updateColor(e.target.value));
$("finishSelect").addEventListener("change", e => {
  currentConfig.finish = e.target.value;
  setBodyFinish(Number(e.target.value));
  $("footerColor").textContent = `${colorName(currentConfig.color)} ${e.target.selectedOptions[0].text.toUpperCase()}`;
});
document.querySelectorAll(".choice").forEach(choice => choice.addEventListener("click", () => {
  document.querySelectorAll(".choice").forEach(c => c.classList.toggle("selected", c === choice));
  currentConfig.wheel = choice.dataset.wheel;
  setWheelStyle(choice.dataset.wheel);
}));
$("modelFile").addEventListener("change", async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  try { await loadModelFile(file); setStatus("Modelo personalizado cargado"); notify("Modelo 3D cargado correctamente."); }
  catch (err) { console.error(err); notify("No se pudo cargar el modelo. Comprueba que sea GLB o GLTF válido."); }
  e.target.value = "";
});
$("demoModelBtn").addEventListener("click", () => { resetDemoModel(); setStatus("Visor 3D listo"); notify("Modelo de demostración restaurado."); });
$("orbitBtn").addEventListener("click", () => setCameraView("orbit"));
$("frontBtn").addEventListener("click", () => setCameraView("front"));
$("sideBtn").addEventListener("click", () => setCameraView("side"));
$("topBtn").addEventListener("click", () => setCameraView("top"));

$("saveBtn").addEventListener("click", () => {
  const project = { app: "AutoStudio 3D", version: "0.1", savedAt: new Date().toISOString(), config: currentConfig };
  localStorage.setItem("autostudio3d-project", JSON.stringify(project));
  const blob = new Blob([JSON.stringify(project, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "mi-configuracion-autostudio.json"; a.click();
  URL.revokeObjectURL(url);
  notify("Configuración guardada y exportada.");
});
$("resetBtn").addEventListener("click", () => {
  currentConfig = { vehicleId: vehicles[0].id, color: "#d6d9dd", finish: "0.28", wheel: "5" };
  vehicleSelect.value = vehicles[0].id; selectVehicle(vehicles[0].id);
  $("finishSelect").value = "0.28"; $("customColor").value = "#d6d9dd";
  document.querySelectorAll(".choice").forEach(c => c.classList.toggle("selected", c.dataset.wheel === "5"));
  updateColor("#d6d9dd"); setBodyFinish(.28); setWheelStyle("5"); resetDemoModel();
  notify("Configuración restablecida.");
});

initViewer("canvasHost").then(() => {
  $("loadingMessage").classList.add("hidden");
  setBodyColor(currentConfig.color);
}).catch(err => {
  console.error(err);
  $("loadingMessage").textContent = "No se pudo iniciar WebGL. Prueba con un navegador actualizado.";
  setStatus("Error del visor");
});
selectVehicle(vehicles[0].id);
