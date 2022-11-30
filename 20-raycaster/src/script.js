import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

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
 * Objects
 */

// Detect if there is a wall in front of the player?
// Test if the last gun hit something
// Test if something is currently under the mouse to simulate mouse event
// Show an alert message if the spaceship is heading toward a planet

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
// const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0); // the direction has to be normalized (needs to be one)?
// rayDirection.normalize(); // keeps direction, but turns into one
// raycaster.set(rayOrigin, rayDirection);
// // After normalizing and giving an origin and direction, you need to use intersect whihc object
// const intersect = raycaster.intersectObject(object2); // returns an array, because the raycaster can go through your object more thah once...
// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersect);
// console.log(intersects);

const raycaster = new THREE.Raycaster();

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
 * Mouse
 */
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -((event.clientY / sizes.height) * 2 - 1);
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

let currentIntersect = null;

window.addEventListener("click", () => {
  if (currentIntersect) {
    if (currentIntersect.object === object1) {
      console.log("clicked on object1");
    } else if (currentIntersect.object === object2) {
      console.log("clicked on object2");
    } else if (currentIntersect.object === object3) {
      console.log("clicked on object3");
    }
  }
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Raycaster
  // Origin, Direction, intersection
  //   const raycasterOrigin = new THREE.Vector3(-3, 0, 0);
  //   const raycasterDirection = new THREE.Vector3(10, 0, 0);
  //   raycasterDirection.normalize();

  //   raycaster.set(raycasterOrigin, raycasterDirection);
  //   const objectsToTest = [object1, object2, object3];
  //   const intersections = raycaster.intersectObjects(objectsToTest);

  //   for (const object of objectsToTest) {
  //     object.material.color.set("#ff0000");
  //   }

  //   for (const intersection of intersections) {
  //     intersection.object.material.color.set("#0000ff");
  //   }

  // Hovering with mouse
  // We need the coorindates of the mouse but in pixels, we need a value that goes from -1 to 1 in horizontal and vertical axes
  raycaster.setFromCamera(mouse, camera);
  const objectsToTest = [object1, object2, object3];
  const intersections = raycaster.intersectObjects(objectsToTest);
  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }

  for (const intersection of intersections) {
    intersection.object.material.color.set("#0000ff");
  }

  if (intersections.length) {
    if (currentIntersect === null) {
      console.log("mousenter");
    }
    currentIntersect = intersections[0];
  } else {
    if (currentIntersect) {
      console.log("mouse leave");
    }
    currentIntersect = null;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
