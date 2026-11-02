import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, camera, renderer, controls, carRoot, bodyMeshes = [], wheelGroups = [], demoRoot, host;
const loader = new GLTFLoader();

export async function initViewer(hostId) {
  host = document.getElementById(hostId);
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x171e27, 12, 32);
  camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, .1, 100);
  camera.position.set(7, 4.2, 8);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .055; controls.target.set(0, .8, 0);
  controls.minDistance = 4; controls.maxDistance = 16; controls.maxPolarAngle = Math.PI * .48;
  scene.add(new THREE.HemisphereLight(0xddeaff, 0x242b34, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(5, 8, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9db8e8, 2.2); rim.position.set(-6, 4, -5); scene.add(rim);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200,200), new THREE.MeshStandardMaterial({color:0x171e27, roughness:.82}));
  floor.rotation.x = -Math.PI/2; floor.position.y = -.04; scene.add(floor);
  const grid = new THREE.GridHelper(40, 40, 0x48515e, 0x303945); grid.position.y = -.025; scene.add(grid);
  createDemoCar();
  window.addEventListener("resize", resize);
  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
}
function resize() {
  if (!host || !renderer) return;
  const w = host.clientWidth, h = host.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
}
function mat(color, roughness=.35, metalness=.35) { return new THREE.MeshStandardMaterial({color, roughness, metalness}); }
function addBox(parent, size, pos, material, bevel=false) {
  const geo = new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geo, material); mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function createDemoCar() {
  demoRoot = new THREE.Group();
  const bodyMat = mat(0xd6d9dd,.28,.72);
  const glassMat = new THREE.MeshPhysicalMaterial({color:0x172432, roughness:.12, metalness:.2, transparent:true, opacity:.88, clearcoat:1});
  const darkMat = mat(0x11151a,.58,.08), trimMat = mat(0x333b45,.3,.65);
  // Silueta conceptual: no representa un modelo comercial real.
  const lower = new THREE.Mesh(new THREE.BoxGeometry(4.45,.72,1.82), bodyMat);
  lower.position.set(0,.78,0); lower.scale.set(1,.92,1); lower.castShadow=true; demoRoot.add(lower); bodyMeshes.push(lower);
  const hood = addBox(demoRoot,[1.25,.22,1.78],[1.38,1.16,0],bodyMat);
  bodyMeshes.push(hood);
  const rear = addBox(demoRoot,[.95,.28,1.78],[-1.62,1.12,0],bodyMat); bodyMeshes.push(rear);
  const cabinGeo = new THREE.BoxGeometry(2.25,.78,1.52);
  const cabin = new THREE.Mesh(cabinGeo,glassMat); cabin.position.set(-.08,1.48,0); cabin.rotation.z=-.035; cabin.castShadow=true; demoRoot.add(cabin);
  const roof = addBox(demoRoot,[1.35,.12,1.52],[-.1,1.9,0],bodyMat); bodyMeshes.push(roof);
  // Umbrales y paragolpes
  addBox(demoRoot,[4.15,.16,.12],[0,.48,.91],trimMat);
  addBox(demoRoot,[4.15,.16,.12],[0,.48,-.91],trimMat);
  addBox(demoRoot,[.18,.28,1.7],[2.22,.7,0],darkMat);
  addBox(demoRoot,[.18,.28,1.7],[-2.22,.7,0],darkMat);
  // Cristales frontales/laterales simplificados
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(.1,.58,1.42),glassMat); windshield.position.set(1.02,1.52,0); windshield.rotation.z=-.23; demoRoot.add(windshield);
  const backGlass = new THREE.Mesh(new THREE.BoxGeometry(.1,.5,1.4),glassMat); backGlass.position.set(-1.16,1.52,0); backGlass.rotation.z=.28; demoRoot.add(backGlass);
  // Luces
  const lightMat = new THREE.MeshStandardMaterial({color:0xeaf4ff,emissive:0xb9dfff,emissiveIntensity:1.6});
  addBox(demoRoot,[.06,.12,.48],[2.29,1.02,.62],lightMat);
  addBox(demoRoot,[.06,.12,.48],[2.29,1.02,-.62],lightMat);
  const tailMat = new THREE.MeshStandardMaterial({color:0xc51f32,emissive:0x6c0713,emissiveIntensity:.8});
  addBox(demoRoot,[.06,.12,.48],[-2.29,1.04,.62],tailMat);
  addBox(demoRoot,[.06,.12,.48],[-2.29,1.04,-.62],tailMat);
  // Ruedas independientes para poder cambiar el estilo
  const rubber = mat(0x101317,.88,.02);
  for (const x of [-1.42,1.42]) for (const z of [-.94,.94]) {
    const group = new THREE.Group(); group.position.set(x,.57,z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.28,40),rubber);
    tire.rotation.x=Math.PI/2; tire.castShadow=true; group.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.292,40),mat(0x9ca7b4,.22,.85));
    rim.rotation.x=Math.PI/2; group.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.3,24),mat(0x303943,.2,.8));
    hub.rotation.x=Math.PI/2; group.add(hub);
    group.userData.rim = rim; group.userData.hub = hub;
    demoRoot.add(group); wheelGroups.push(group);
  }
  demoRoot.position.y=0; scene.add(demoRoot); carRoot=demoRoot;
}
export function setBodyColor(hex) {
  const color = new THREE.Color(hex);
  bodyMeshes.forEach(mesh => { if(mesh.material?.color) mesh.material.color.copy(color); });
}
export function setBodyFinish(roughness) { bodyMeshes.forEach(mesh => { if(mesh.material) mesh.material.roughness=roughness; }); }
export function setWheelStyle(style) {
  wheelGroups.forEach(group => {
    const rim=group.userData.rim;
    rim.material = mat(style==="mesh"?0x7f8b99:0xb4bdc8,.22,.9);
    rim.geometry.dispose();
    const radial = style==="5" ? 5 : style==="10" ? 10 : 16;
    const spokes = new THREE.Group();
    const spokeMat=mat(0xabb6c3,.2,.9);
    for(let i=0;i<radial;i++){
      const bar=new THREE.Mesh(new THREE.BoxGeometry(.055,.035,.58),spokeMat);
      bar.position.set(0,0,0); bar.rotation.y=(i/radial)*Math.PI*2;
      bar.position.x=Math.sin(bar.rotation.y)*.14; bar.position.z=Math.cos(bar.rotation.y)*.14;
      spokes.add(bar);
    }
    // Guardamos y sustituimos solo la decoración anterior.
    if(group.userData.spokes) group.remove(group.userData.spokes);
    spokes.position.z=.16; group.add(spokes); group.userData.spokes=spokes;
  });
}
export function setCameraView(view) {
  const positions={orbit:[7,4.2,8],front:[7,2.4,0],side:[0,2.5,9],top:[0,10,.1]};
  const p=positions[view]||positions.orbit;
  camera.position.set(...p); controls.target.set(0,.8,0); controls.update();
}
export function resetDemoModel() {
  if(carRoot && carRoot!==demoRoot) scene.remove(carRoot);
  carRoot=demoRoot; scene.add(demoRoot);
  setBodyColor("#d6d9dd"); setBodyFinish(.28); setWheelStyle("5");
}
export async function loadModelFile(file) {
  const url=URL.createObjectURL(file);
  try {
    const gltf=await loader.loadAsync(url);
    if(carRoot && carRoot!==demoRoot) scene.remove(carRoot);
    const model=gltf.scene;
    const box=new THREE.Box3().setFromObject(model);
    const size=box.getSize(new THREE.Vector3());
    const center=box.getCenter(new THREE.Vector3());
    const maxDim=Math.max(size.x,size.y,size.z)||1;
    model.scale.setScalar(4.5/maxDim);
    model.position.sub(center.multiplyScalar(4.5/maxDim));
    model.position.y += .5;
    scene.add(model); carRoot=model;
    controls.target.set(0,.8,0); controls.update();
  } finally { URL.revokeObjectURL(url); }
}
