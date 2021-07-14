import * as THREE from 'three';
import * as dat from 'dat.gui';

// SET UP

// scene
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf);
const gui = new dat.GUI();

// camera
const fov = 90;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 20, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

// lighting
const color = 0xffffff;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// OBJECTS

const objects = [];
const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);

// solar system
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

// sun
const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5); // 5x sun size
solarSystem.add(sunMesh);
objects.push(sunMesh);

// earth orbit
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

// earth
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244,
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

// moon orbit
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);
objects.push(moonOrbit);

// moon
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222,
});

const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

// ADD HELPERS

// create a class that will check off both AxesHelper and GridHelper
class AxesGridHelper {
  constructor(node, units = 10) {
    // create and add AxesHelper
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2;
    node.add(axes);

    // create and add GridHelper
    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    // set properties
    this.axes = axes;
    this.grid = grid;
    this.visible = false; // set default visibility to false
  }

  // getter and setter
  get visible() {
    return this._visible;
  }

  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

// create instance of AxesGridHelper for each object and feed into dat.GUI
function makeAxisGrid(node, label, units) {
  const helper = new AxesGridHelper(node, units);
  gui.add(helper, 'visible').name(label);
}

makeAxisGrid(solarSystem, 'solarSystem', 25);
makeAxisGrid(sunMesh, 'sunMesh');
makeAxisGrid(earthOrbit, 'earthOrbit');
makeAxisGrid(earthMesh, 'earthMesh');
makeAxisGrid(moonOrbit, 'moonOrbit');
makeAxisGrid(moonMesh, 'moonMesh');

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

//  ANIMATION RENDER LOOP
function render(time) {
  time *= 0.001; // converts ms to s

  // check for resize / if yes, resize camera ratio
  if (resizeRenderer(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix(); // needs to be called everytime you change camera
  }

  // render each object that animates
  objects.forEach((obj, i) => {
    const speed = i * 0.1 + 1;
    const rotation = time * speed;
    obj.rotation.y = rotation;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
