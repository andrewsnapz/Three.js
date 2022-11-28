import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
// import { typeFaceFont } from "three/examples/fonts/helvetiker_bold.typeface.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// const axisHelper = new THREE.AxesHelper();
// scene.add(axisHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapMaterial = textureLoader.load("textures/matcaps/3.png");
/**
 * Font
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Bounding is an information associated with the geometry that tells what space is taken by that geometry
  // it can be box or a shpere
  // Frustum Culling
  // Default, Three.js uses sphere bounding

  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.y - 0.2) / 2,
  //   -(textGeometry.boundingBox.max.z - 0.3) / 2
  // );
  // textGeometry.computeBoundingBox();
  // console.log(textGeometry.boundingBox);

  textGeometry.center();

  // const textMaterial = new THREE.MeshBasicMaterial();
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapMaterial });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  console.time("donuts");
  const donutGeometry = new THREE.TorusGeometry(0.1, 0.2, 20, 45);
  // const donutMaterial = new THREE.MeshMatcapMaterial({
  //   matcap: matcapMaterial,
  // });

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, textMaterial);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y - Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
  console.timeEnd("donuts");
});

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
