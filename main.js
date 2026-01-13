const { scene, camera, renderer, lanes, hexes, dust } = window.FP;

let mx = 0, my = 0;
addEventListener("mousemove", e => {
  mx = (e.clientX / innerWidth - .5) * 8;
  my = (e.clientY / innerHeight - .5) * 4;
});
addEventListener("touchmove", e => {
  const t = e.touches[0];
  mx = (t.clientX / innerWidth - .5) * 8;
  my = (t.clientY / innerHeight - .5) * 4;
});

const clock = new THREE.Clock();

function loop() {
  requestAnimationFrame(loop);
  const t = clock.getElapsedTime();

  /* Tunnel to open */
  camera.position.z = 18 - Math.min(t * 2, 10);

  /* Parallax */
  camera.position.x += (mx - camera.position.x) * .05;
  camera.position.y += (4 + my - camera.position.y) * .05;
  camera.lookAt(0, 0, 0);

  /* Lane breathing */
  lanes.forEach((l, i) => {
    l.material.emissiveIntensity = .4 + Math.sin(t * 3 + i * .3) * 1.1;
  });

  /* Hex pulse */
  hexes.forEach(h => {
    h.material.emissiveIntensity = .4 + Math.sin(t + h.position.x + h.position.z) * .5;
    h.position.y = .06 + Math.sin(t + h.position.x) * .03;
  });

  dust.rotation.y += .0005;

  renderer.render(scene, camera);
}
loop();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
