const { scene, camera, renderer, lanes, lights, dust } = window.FP;

let mx = 0, my = 0;
addEventListener("mousemove", e => {
  mx = (e.clientX / innerWidth - .5) * 6;
  my = (e.clientY / innerHeight - .5) * 3;
});
addEventListener("touchmove", e => {
  const t = e.touches[0];
  mx = (t.clientX / innerWidth - .5) * 6;
  my = (t.clientY / innerHeight - .5) * 3;
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  /* Camera tunnel → hall */
  camera.position.z = 18 - Math.min(t * 2, 12);
  camera.position.x += (mx - camera.position.x) * 0.05;
  camera.position.y += (3.5 + my - camera.position.y) * 0.05;
  camera.lookAt(0, 2, 0);

  /* Light breathing */
  lights.forEach((l, i) => {
    l.material.emissiveIntensity = 0.5 + Math.sin(t * 3 + i * 0.3) * 0.6;
  });

  /* Lane pulse */
  lanes.forEach((l, i) => {
    l.material.emissiveIntensity = 0.8 + Math.sin(t * 4 + i) * 0.8;
  });

  /* Dust drift */
  dust.rotation.y += 0.0005;
  dust.position.y = 2 + Math.sin(t * 0.4) * 1;

  /* World breathing */
  scene.rotation.y = Math.sin(t * 0.1) * 0.02;

  renderer.render(scene, camera);
}
animate();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
