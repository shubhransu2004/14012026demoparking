/* ============================================
   FEEPARKING — GARAGE ANIMATION ENGINE
============================================ */

const {
  scene,
  camera,
  renderer,
  floor,
  laneGroup,
  hexGroup,
  particles
} = window.FeeParkingScene;

/* ============================================
   Mouse & Touch Input
============================================ */

let targetX = 0;
let targetY = 0;

document.addEventListener("mousemove", e => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 8;
  targetY = (e.clientY / window.innerHeight - 0.5) * 4;
});

document.addEventListener("touchmove", e => {
  if (e.touches.length > 0) {
    const t = e.touches[0];
    targetX = (t.clientX / window.innerWidth - 0.5) * 8;
    targetY = (t.clientY / window.innerHeight - 0.5) * 4;
  }
});

/* ============================================
   Animation Clock
============================================ */

const clock = new THREE.Clock();

/* ============================================
   Animate
============================================ */

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  /* Camera motion */
  camera.position.x += (targetX - camera.position.x) * 0.05;
  camera.position.y += (6 + targetY - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  /* Lane light breathing */
  laneGroup.children.forEach((lane, i) => {
    const pulse = Math.sin(t * 2 + i * 0.3) * 0.5 + 0.5;
    lane.material.emissiveIntensity = 0.3 + pulse * 1.2;
  });

  /* Hex tile glow */
  hexGroup.children.forEach((hex, i) => {
    const wave = Math.sin(t * 1.5 + (hex.position.x + hex.position.z) * 0.3);
    hex.material.emissiveIntensity = 0.4 + wave * 0.6;
  });

  /* Subtle hex bob */
  hexGroup.children.forEach(hex => {
    hex.position.y = 0.05 + Math.sin(t + hex.position.x) * 0.03;
  });

  /* Particle drift */
  particles.rotation.y += 0.0005;
  particles.position.z = Math.sin(t * 0.1) * 2;

  /* Soft camera sway */
  camera.rotation.z = Math.sin(t * 0.2) * 0.01;

  renderer.render(scene, camera);
}

animate();
