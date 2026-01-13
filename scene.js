const canvas = document.getElementById("gl");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0b0f14, 10, 90);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 300);
camera.position.set(0, 4, 18);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

/* Lights */
scene.add(new THREE.AmbientLight(0x557799, .4));

const key = new THREE.DirectionalLight(0x99ccff, 1.1);
key.position.set(6, 12, 6);
scene.add(key);

const gold = new THREE.PointLight(0xffcc88, 1.1, 50);
gold.position.set(-6, 6, 6);
scene.add(gold);

/* Floor */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 300),
  new THREE.MeshStandardMaterial({ color: 0x111418, roughness: .8, metalness: .2 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

/* Tunnel walls */
const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f141a, roughness: .7, metalness: .3 });
for (let i = -1; i <= 1; i += 2) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 80), wallMat);
  wall.position.set(i * 7, 3, -20);
  scene.add(wall);
}

/* Lane lights */
const lanes = [];
for (let i = -10; i <= 10; i++) {
  const l = new THREE.Mesh(
    new THREE.BoxGeometry(.25, .05, 100),
    new THREE.MeshStandardMaterial({ color: 0x66ccff, emissive: 0x224466 })
  );
  l.position.set(i * 1.2, .04, 0);
  scene.add(l);
  lanes.push(l);
}

/* Hex tiles */
const hexes = [];
const hexGeo = new THREE.CylinderGeometry(.9, .9, .1, 6);
for (let x = -10; x <= 10; x += 2.5) {
  for (let z = -10; z <= 10; z += 2.5) {
    const h = new THREE.Mesh(
      hexGeo,
      new THREE.MeshStandardMaterial({ color: 0x121a22, emissive: 0x223344 })
    );
    h.position.set(x, .06, z);
    h.rotation.y = Math.PI / 6;
    scene.add(h);
    hexes.push(h);
  }
}

/* Particles */
const pGeo = new THREE.BufferGeometry();
const p = [];
for (let i = 0; i < 2000; i++) {
  p.push((Math.random() - .5) * 120, Math.random() * 10 + 1, (Math.random() - .5) * 120);
}
pGeo.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
const dust = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x88bbff, size: .12, opacity: .4, transparent: true }));
scene.add(dust);

/* Export */
window.FP = { scene, camera, renderer, lanes, hexes, dust };
