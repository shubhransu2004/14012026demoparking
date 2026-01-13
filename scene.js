const canvas = document.getElementById("gl");

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0e12, 0.025);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 500);
camera.position.set(0, 3.5, 20);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x070a0d);

/* --- Lighting --- */
scene.add(new THREE.AmbientLight(0x334455, 0.4));

const key = new THREE.DirectionalLight(0x99cfff, 1.1);
key.position.set(10, 15, 5);
scene.add(key);

const rim = new THREE.DirectionalLight(0xffcc88, 0.6);
rim.position.set(-8, 10, -5);
scene.add(rim);

/* --- Materials --- */
const concrete = new THREE.MeshStandardMaterial({ color: 0x11161c, roughness: 0.75, metalness: 0.15 });
const dark = new THREE.MeshStandardMaterial({ color: 0x0b0f14, roughness: 0.9 });
const lightBlue = new THREE.MeshStandardMaterial({ color: 0x66b6ff, emissive: 0x225577 });

/* --- Floor --- */
const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), concrete);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

/* --- Ceiling --- */
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), dark);
ceiling.position.y = 6;
ceiling.rotation.x = Math.PI / 2;
scene.add(ceiling);

/* --- Tunnel Walls --- */
const wallGeo = new THREE.BoxGeometry(6, 6, 120);
const leftWall = new THREE.Mesh(wallGeo, dark);
leftWall.position.set(-10, 3, -20);
scene.add(leftWall);

const rightWall = new THREE.Mesh(wallGeo, dark);
rightWall.position.set(10, 3, -20);
scene.add(rightWall);

/* --- Pillars --- */
for (let z = -60; z <= 60; z += 15) {
  for (let x = -18; x <= 18; x += 18) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), concrete);
    p.position.set(x, 3, z);
    scene.add(p);
  }
}

/* --- Overhead Lights --- */
const lights = [];
for (let z = -80; z <= 80; z += 8) {
  const bar = new THREE.Mesh(new THREE.BoxGeometry(18, .1, .5), lightBlue);
  bar.position.set(0, 5.8, z);
  scene.add(bar);
  lights.push(bar);
}

/* --- Guidance Lanes --- */
const lanes = [];
for (let x = -6; x <= 6; x += 3) {
  const lane = new THREE.Mesh(new THREE.BoxGeometry(.25, .05, 200), lightBlue);
  lane.position.set(x, .04, 0);
  scene.add(lane);
  lanes.push(lane);
}

/* --- Dust Particles --- */
const dustGeo = new THREE.BufferGeometry();
const dustCount = 3000;
const dustPos = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount; i++) {
  dustPos[i * 3] = (Math.random() - .5) * 200;
  dustPos[i * 3 + 1] = Math.random() * 8;
  dustPos[i * 3 + 2] = (Math.random() - .5) * 200;
}

dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x88aaff, size: 0.12, transparent: true, opacity: 0.4 }));
scene.add(dust);

window.FP = { scene, camera, renderer, lanes, lights, dust };
