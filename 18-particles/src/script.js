import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/*
    Particles can be used to create stars, smoke, rain, dust,
    fire, etc. You can have thousands of them with reasonable
    framerate. Each particle is composed of a plane (two triangles)
    always facing the camera

    Particle needs Geometry and Material (Point Materials),
    uses Point (not a Mesh)
*/

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");
/**
 * Test cube
 */

/**
 * Geometry
 */

// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true, // if distant particles should be smaller than close particles
// });
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

// Custom Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3); // rgb

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10; // num between -0.5 to 0.5
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// particles don't know whether they should be in front of behind each other
// GPU just draws the particle
// Multiple ways to fix this
// AlphaTest (value between 0 and 1) that enables the WebGL knows when to not to render the pixel according to the pixel's transparency
// DepthTest: when webGL is drawing the particles, the GPU guesses if a particle is front of another
// Deactivating the depth testing might create bugs if you have other objects in your scene or particles with different colors
// Using depth write: depth of what's being drawn is stored in what we call a depth buffer. Instead of not testing if the particle is closer than what's in the depth buffer, we can tell WebGL not to write particles in that depth buffer with depthTest
// depthWrite is usually a good fix (can contain bugs, depends on project...)
// Blending: webGL currently draws pixles one on top of the other. With blending, we can tell WebGL to add the color of the pixel to the color of the pixel already drawn
// Combines particle colors...(?) Impacts performance (Can be used for sparkles)
const material = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  //   color: "red",
  //   map: particleTexture,
  transparent: true,
  alphaMap: particleTexture,
  //   alphaTest: 0.001,
  //   depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});
const pointer = new THREE.Points(particlesGeometry, material);

scene.add(pointer);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Updating all Particles:
  // pointer.rotation.y = elapsedTime * 0.2;

  // particleGeometry.attributes.position.array - considered a bad idea...
  // A lot of work for the GPU, bad for performance
  // Best way to do is using a custom shader...

  //   for (let i = 0; i < count; i++) {
  //     const i3 = i * 3;

  //     const x = particlesGeometry.attributes.position.array[i3];

  //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
  //       elapsedTime + x
  //     );
  //   }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
