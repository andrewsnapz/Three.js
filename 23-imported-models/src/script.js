import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/*
3D model formats, each one responding to a problem
    - What data: Weight, Compression, Compatibility, Copyrights, Etc...
Different Criteria
    - Dedicated to one software
    - Very light but might lack specific data
    - Almost all data but are heavy
    - Open source
    - Not open source
    - Binary
    - ASCII
    - Etc...
Popular Formats:
    - OBJ
    - FBX
    - STL
    - PLY
    - COLLADA
    - 3DS
    - GLTF
One format that is becoming the standard: GLTF
    - GLTF: GL Transmission Format
    - Looks like it came right outta blender...
    - Question the data you need, the weight of the file, how much time to decompress it, etc
    - GLTF has testing models! https://github.com/KhronosGroup/glTF-Sample-Models
GLTF formats
    - glTF
        - default format
        - Multiple files
        - .gltf is a JSON that contains cameras, lights, screens, materials object transformation, but no geometries and textures
        - .bin is a binary that usually contains the data like geometries 
        - .png is the texture
        - When we load the .gtlf file and other files should load automatically
    - glTF-Binary
        - Only one file
        - Contains all the data we talked about
        - Binary
        - Usually lighter
        - Easier to load because only one file
        - Hard to alter its data
    - glTF-Draco
        - Like the glTF default format, but the buffer data is compressed using the Draco Algo
        - Much lighter
    - glTF-Embedded
        - One file like the glTF-Binary format
        - JSON
        - Heavier
        - Usually not used (heaviest of them all...)
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
 * Models
 */

/*
When to use the DracoCompression
    - It also takes time and resources for your computer to decode a compressed file
    - The geometries are lighter but the user has to load the DRACOLoader class and the decoder
*/
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

gltfLoader.load(
  //   "/models/Duck/glTF/Duck.gltf",
  //   "/models/Duck/glTF-Binary/Duck.glb",
  //   "/models/Duck/glTF-Draco/Duck.gltf",
  //   "/models/Duck/glTF-Embedded/Duck.gltf",
  //   "/models/FlightHelmet/glTF/FlightHelmet.gltf",
  "/models/Fox/glTF/Fox.gltf",
  function success(gtlf) {
    mixer = new THREE.AnimationMixer(gtlf.scene);
    const action = mixer.clipAction(gtlf.animations[0]);
    action.play();

    // while (gtlf.scene.children.length) {
    //   scene.add(gtlf.scene.children[0]);
    // }

    // const children = [...gtlf.scene.children];
    // for (const child of children) {
    //   scene.add(child);
    // }
    gtlf.scene.scale.set(0.025, 0.025, 0.025);
    scene.add(gtlf.scene);
  },
  function progress() {
    console.log("process");
  },
  function error() {
    console.log("error");
  }
);

// Our camera and mesh are inside scene children
/* Multiple ways of adding the duck to our scene...
    - Add the whole scene to our scene
    - Add the children of the scene to our scene and ignore the Perspective Camera
    - Filter the children before adding to the scene
    - Add only the Mesh and end up with a duck with a wrong scale, position, and rotation
        - scale is applied to its parent NOT the Mesh itself
    - Open the file in a 3D software, clean it, and export it again  
*/

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update Mixer
  if (mixer !== null) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
