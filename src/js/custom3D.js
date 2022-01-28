// LOADING 3D MODELS (GLTFS)

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// SET UP
// scene
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();

// camera
const fov = 90;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);

// allows you to drag camera around and zoom in / out
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

// light
const skyColor = 0xb1e1ff; // light blue
const groundColor = 0xb97a20; // brownish orange
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

// LOADING

// loading
const gltfLoader = new GLTFLoader();
const url =
  'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
gltfLoader.load(url, gltf => {
  const root = gltf.scene;
  scene.add(root);

  // compute box that contains scene we loaded
  const box = new THREE.Box3().setFromObject(root);
  const boxSize = box.getSize(new THREE.Vector3()).length();
  const boxCenter = box.getCenter(new THREE.Vector3());

  // resize camera according to model size
  // 1.2 gives us 20% more spacing above and below box
  frameArea(boxSize * 1.2, boxSize, boxCenter, camera);
});

// compute distance from camera to model (using trig!)
// then point camera at center of box
// distance = halfSizeToFitOnScreen / tangent(halfFovY)
function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

  // compute unit vector pointing from center of box to camera
  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    .normalize();

  // move camera to a position distance units away from box center
  // in direction the camera was from the center before
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick near and far values that will contain box
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point camera to look at center of box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

// RESPONSIVENESS
function resizeRenderer(renderer) {
  const canvas = renderer.domElement;
  const width = (canvas.clientWidth * window.devicePixelRatio) | 0;
  const height = (canvas.clientHeight * window.devicePixelRatio) | 0;
  const needsResize = width !== canvas.width || height !== canvas.height;

  if (needsResize) {
    renderer.setSize(width, height, false);
  }

  return needsResize;
}

// RENDER LOOP
function render(time) {
  time *= 0.001; // converts ms to s

  // check for resize / if yes, resize camera ratio
  if (resizeRenderer(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix(); // needs to be called everytime you change camera
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
