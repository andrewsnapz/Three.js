import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "green" })
);

group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "red" })
);

group.add(cube2);

cube2.position.set(1.5, 0, 0);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "blue" })
);

group.add(cube3);

cube3.position.set(-1.5, 0, 0);

group.position.y = 1;
group.scale.y = 2;

// 4 properties of Objects
// 1. Position
// 2. Scale
// 3. Rotation
// 4. Quaternion

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// Axes Helper:
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// the unit can be anything, it can be 1cm, 1m, 1kilometer, etc...
// mesh.position.x = -1;
// mesh.position.y = 0.5;
// mesh.position.z = 0;
// mesh.position.set(0.7, -0.6, 1);
// position inherits from Vector3

// console.log(mesh.position.length());
// mesh.position.normalize(); // reduce the length of the vector to 1
// console.log(mesh.position.length());

// Scale is also a vector3
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
// mesh.scale.set(2, 0.5, 0.5);

// Rotation
// Rotation is an Euler? (not a vector3). It's like sticking a stick through an object
// Gimbal Lock: when you can't change rotation
// Quaternion also expresses a rotation, but in a more mathematical way

// First do Y, X, and then apply Z;
// mesh.rotation.reorder("YXZ");

// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.position.x = 1;
// camera.position.y = 1;
scene.add(camera);

// camera.lookAt(mesh.position);

// console.log(mesh.position.distanceTo(camera.position));
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
