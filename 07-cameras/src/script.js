import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Need mouse controls:
// Cursor:
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  cursor.x = clientX / sizes.width - 0.5; // value is going to zero to one.
  cursor.y = -(clientY / sizes.height - 0.5);
});

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
// Stereo Camera: render the scene through two cameras that mimic the eyes (VR)
// Cube Camera: CubeCamera do 6 renders, each one facing a different direction. Evironment map, reflection, or shadow map
// Orthographic Camera: renders a scene without perspective

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// params: FOV (in degrees)
// aspect-ratio: the width of the renderer divided by the height of the render
// near how close the camera can see (1 or 1000)
// far how far the camera can see (1 or 1000)

// need the aspect-ratio, the square is stretching to fit the canvas, making the square look like a rectangle
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.01,
//   100
// );
// params: left, right. top, bottom

// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;

camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.target.y = 2;
// controls.update();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  //   mesh.rotation.y = elapsedTime;

  // Update camera
  // sin and cos, gives a position in a circle
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  //   camera.position.y = cursor.y * 5;
  //   camera.lookAt(mesh.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
