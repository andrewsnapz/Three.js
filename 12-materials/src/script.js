import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();

const properties = {
  metalness: 0.7,
  roughness: 0.2,
  aoMapIntensity: 1,
  displacementScale: 0,
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// const loaderManager = new THREE.loaderManager()
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const cubeTextureLoader = new THREE.CubeTextureLoader();
const emvironmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

// const material = new THREE.MeshBasicMaterial();
// material.color.set("yellow");
// material.color = new THREE.Color("red");
// material.map = doorColorTexture;
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.2;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide; // More calculations...

// NormalMaterial: Info that contains the direction of the outside of the face
// Used for lighting, reflection, refraction, etc...
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// MatcapMaterial: display a color by using normals as a reference to pick the right color on a texture
// Simulates light without putting a light
// https://github.com/nidorx/matcaps
// Use 3D software... put camera with light on shape
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// Color the geometry in white if the camera is near...
// darken the geometry the further the camera away
// Can used to create fog
// const material = new THREE.MeshDepthMaterial();

// LamberMaterial: will react to light
// Performat, but you can see strange patterns on the geometry, good for framerates
// const material = new THREE.MeshLambertMaterial();

// PhongMaterial reacts to light
// Less performat, but more strain on framerates
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// // Red reflection:
// material.specular = new THREE.Color("red");

// ToonMaterial
// const material = new THREE.MeshToonMaterial();
// // magFilter tries to fix it with mipmapping
// // set minFilter and magFilter to THREE.NearestFilter
// // if min and mag filters are both NearestFilter, turn off generateMipmaps
// material.gradientMap = gradientTexture;

// Standard Material
// PBR Physically based rendering
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
// https://polyhaven.com/
material.envMap = emvironmentMapTexture;
// material.map = doorColorTexture;
// // ambient occlusion, adds shadow to crevices. Needs UV coordinates...
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// // Normal map, more details. Cheap for the CPU, add it!
// material.normalMap = doorNormalTexture;
// // material.normalScale.set(0.5, 0.5);
// // want to use alphaMap, you need to set the transparency
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// PointsMaterial: create particles... future lesson
// ShaderMaterial and RawShaderMaterial both can used to create your own material

// EnvironmentMap image of what is surrounding the scene. It can be used for reflection or refraction but also for general lighting
// Only supports cube maps

gui.add(properties, "metalness").min(0).max(1).step(0.001);
gui.add(properties, "roughness").min(0).max(1).step(0.001);
gui.add(properties, "aoMapIntensity").min(1).max(10).step(0.001);
gui.add(properties, "displacementScale").min(0).max(1).step(0.001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 15, 15), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
scene.add(torus, sphere, plane);

plane.position.x = 0;
sphere.position.x = -1.5;
torus.position.x = 1.5;

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
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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

  // Update Objects:
  sphere.rotation.y = elapsedTime * 0.1;
  plane.rotation.y = elapsedTime * 0.1;
  torus.rotation.y = elapsedTime * 0.1;

  sphere.rotation.x = elapsedTime * 0.15;
  plane.rotation.x = elapsedTime * 0.15;
  torus.rotation.x = elapsedTime * 0.15;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
