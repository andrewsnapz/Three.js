import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import imageSource from "../static/textures/door/color.jpg";

// Textures:
// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   texture.needsUpdate = true;
// };
// image.src = "/textures/door/color.jpg";

// One textureLoader can load multiple textures...
const loadingManager = new THREE.LoadingManager(); // Progress of loading mutliple events (Text, Images, etc...)
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.log("onError");
};

// const colorTexture = textureLoader.load(
//   "/textures/door/color.jpg",
//   () => {
//     console.log("load");
//   },
//   () => {
//     console.log("progress"); // doesn't really work...? Either zero or 100...
//   },
//   () => {
//     console.log("error");
//   }
// );
const colorTexture = textureLoader.load("/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// Vector2, 2D coordinates...
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// its in radians
// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

// Filtering and mipmapping
// Mipmapping: is a technique that consists of creating a half a smaller version of a texture again and again until we get a 1 x 1 texture
// All those texture variations are sent to the GPU, and the GPU will choose the most appropriate version of the texture
// GPU picks these texture based on pixels?
// Minification filter
// The further away you are from the object, the minFilter will change the texture?

colorTexture.generateMipmaps = false; // used with minFilter?
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter; // Leads to better framerates...

/*
    When creating textures, there are 3 crucial elements:
    1. The weight: users have to download the textures.
        - jpg: lossy compression but usually lighter
        - png: loseless compression but usually heavier
        - TinyPNG: compresses jpg and png files 
    2. The size: textures are sent to the GPU, you cannot send huge texture sizes  to the GPU (GPU has limitations)
        - Smaller the better
        - When using mipmapping, texture will reduce to a 1 x 1 size, therefore, the texture's width and height must be a power of 2
    3. The data
        - Textures support transparency but we can't have transparency in jpg
        - If want to have only one texture that combine color and alpha, we better use a png file
        - If we are using a normal texture we need the exact values which is why we shouldn't apply lossy compression, better to use png for those
*/

/*
    Where to find textures?
    - poliigon.com
    - 3dtexture.me
    - arroway-textures.ch

    make sure you have the right to use licenses...

    Photoshop with Substance Designer
*/

/*
PBR principles
Physically Based Rendering
    - Real life results
    - Becoming standard for realistic results
*/

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

// UV unwrapping: when texture is being stretched or squeezed in different ways to cover the geomtry
// If you create your own geometry you'll have to specify the UV coordinates
// If you are making the geometry using a 3D software, you'll also have to do the UV unwrapping

const geometry = new THREE.BoxGeometry(1, 1, 1);
// console.log(geometry.attributes.uv);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
