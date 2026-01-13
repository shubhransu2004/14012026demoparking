/* ============================================
   FEEPARKING — 3D GARAGE SCENE
============================================ */

const canvas = document.getElementById("scene");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0d11, 10, 80);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 6, 18);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

/* ============================================
   Lighting
============================================ */

const ambient = new THREE.AmbientLight(0x335577, 0.4);
scene.add(ambient);

const mainLight = new THREE.DirectionalLight(0x99ccff, 1.2);
mainLight.position.set(10, 20, 10);
scene.add(mainLight);

const goldLight = new THREE.PointLight(0xffcc66, 1.2, 40);
goldLight.position.set(-10, 5, 10);
scene.add(goldLight);

/* ============================================
   Floor (dark concrete)
============================================ */

const floorGeo = new THREE.PlaneGeometry(200, 200, 20, 20);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x111418,
  roughness: 0.8,
  metalness: 0.2
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

/* ============================================
   Lane Lights
============================================ */

const laneGroup = new THREE.Group();
scene.add(laneGroup);

for (let i = -10; i <= 10; i++) {
  const laneGeo = new THREE.BoxGeometry(0.15, 0.02, 80);
  const laneMat = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    emissive: 0x224466,
    metalness: 0.8,
    roughness: 0.3
  });
  const lane = new THREE.Mesh(laneGeo, laneMat);
  lane.position.set(i * 1.5, 0.02, 0);
  laneGroup.add(lane);
}

/* ============================================
   Hex Guidance Panels
============================================ */

const hexGroup = new THREE.Group();
scene.add(hexGroup);

const hexGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 6);
const hexMat = new THREE.MeshStandardMaterial({
  color: 0x0a2233,
  emissive: 0x223344,
  metalness: 0.6,
  roughness: 0.4
});

for (let x = -8; x <= 8; x += 2.5) {
  for (let z = -8; z <= 8; z += 2.5) {
    const hex = new THREE.Mesh(hexGeo, hexMat.clone());
    hex.position.set(x, 0.05, z);
    hex.rotation.y = Math.PI / 6;
    hexGroup.add(hex);
  }
}

/* ============================================
   Floating Dust Particles
============================================ */

const particleCount = 1500;
const pGeo = new THREE.BufferGeometry();
const pPositions = [];

for (let i = 0; i < particleCount; i++) {
  pPositions.push((Math.random() - 0.5) * 100);
  pPositions.push(Math.random() * 10 + 1);
  pPositions.push((Math.random() - 0.5) * 100);
}

pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pPositions, 3));

const pMat = new THREE.PointsMaterial({
  color: 0x88bbff,
  size: 0.15,
  transparent: true,
  opacity: 0.4
});

const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

/* ============================================
   Resize Handling
============================================ */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ============================================
   Expose for app.js
============================================ */

window.FeeParkingScene = {
  scene,
  camera,
  renderer,
  floor,
  laneGroup,
  hexGroup,
  particles
};
