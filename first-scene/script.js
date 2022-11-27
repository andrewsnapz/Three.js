console.log(THREE);
/*
4 Elements
1) A scene that will contain objects
2) Some objects
3) A camera
4) renderer?
*/

// SCENE (movie set)
const scene = new THREE.Scene();

// Objects
// Mesh: combination of geometry (the shape) and a material (How it works)
// Geometry and material
// Red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
// Not visible, serve as a point of view when doing a render
// Can have multiple and switch between them
// Different tyoes
// PerspectiveCamera

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Params: vertical vision angle (in degrees) also called FOV
// Second Param: Aspect-Ratio
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Drawn into a canvas element
// WebGL will be drawn into canvas
// Can create canvas in HTML or renderer

// SVG and canvas Renderers (there are different renderers)

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
// resizing the renderer will resize the canvas

// needs scene and camera
renderer.render(scene, camera);
