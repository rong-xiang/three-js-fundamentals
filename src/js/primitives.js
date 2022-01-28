'use strict';

import * as THREE from 'three';

// PRIMITIVES

// set up
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa); // changes bg color

// camera
const fov = 40;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 120;

// lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

/*

// PART I: CREATING SIMPLE CUBES 
function createCube(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = x;
  scene.add(cube);
  return cube;
}

// mesh, material, geometry
const boxGeometry = new THREE.BoxGeometry();

// create cubes and store in array
const cubes = [
  createCube(boxGeometry, 0xffffff, 0),
  createCube(boxGeometry, 0x38174c, -2),
  createCube(boxGeometry, 0xececec, 2),
];

*/

// PART II: CREATING VARIOUS GEOMETRIES
const objects = [];
const spread = 15; // how spread out objects are

// addOject: takes object and adds to scene at specified coordinates
function addObject(x, y, obj) {
  obj.position.x = x * spread;
  obj.position.y = y * spread;
  scene.add(obj);
  objects.push(obj);
}

// createMaterial: creates and returns a random colored material
function createMaterial() {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });

  const hue = Math.random(); // 0 to 1 on color wheel
  const saturation = Math.random(); // 0 to 1
  const luminance = 0.5; // 0.0 (black) to 0.5 (hue)
  material.color.setHSL(hue, saturation, luminance);
  return material;
}

// addSolidGeometry: takes a geometry and creates an object from it
function addSolidGeometry(x, y, geometry) {
  const mesh = new THREE.Mesh(geometry, createMaterial());
  addObject(x, y, mesh);
}

// addLineGeometry: takes edges and wireframe geometry and creates object form it
function addLineGeometry(x, y, geometry) {
  const material = new THREE.LineBasicMaterial({ color: 0x000000 });
  const mesh = new THREE.LineSegments(geometry, material);
  addObject(x, y, mesh);
  console.log('reached');
}

// add objects

const cube = new THREE.BoxGeometry(4, 5, 3);
addSolidGeometry(-2, 2, cube);

const circle = new THREE.CircleGeometry(4, 12, Math.PI * 0.25, Math.PI * 0.75);
addSolidGeometry(-1, 2, circle);

const cone = new THREE.ConeGeometry(3, 10, 32);
addSolidGeometry(0, 2, cone);

const cylinder = new THREE.CylinderGeometry(2, 3, 4, 32);
addSolidGeometry(1, 2, cylinder);

const dodecahedron = new THREE.DodecahedronGeometry(4);
addSolidGeometry(2, 2, dodecahedron);

{
  const heart = new THREE.Shape();
  const x = -2.5;
  const y = -5;
  heart.moveTo(x + 2.5, y + 2.5);
  heart.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  heart.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  heart.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  heart.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  heart.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  heart.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

  const extrudeSettings = {
    steps: 4,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 8,
  };

  const heartExtrude = new THREE.ExtrudeGeometry(heart, extrudeSettings);
  addSolidGeometry(-2, 1, heartExtrude);
}

{
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector2(Math.sin(8 * 0.2) * 3 + 3, (i - 5) * 0.8));
  }

  const lathe = new THREE.LatheGeometry(points, 16, 0.5, 1.5);
  addSolidGeometry(-1, 1, lathe);
}

{
  class CustomSinCurve extends THREE.Curve {
    constructor(scale) {
      super();
      this.scale = scale;
    }

    getPoint(t) {
      const tx = t * 3 - 1.5;
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;
      return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
  }

  const path = new CustomSinCurve(4);
  const tube = new THREE.TubeGeometry(path, 32, 1, 16, closed);
  addSolidGeometry(0, 1, tube);
}

const plane = new THREE.PlaneGeometry(2, 12);
addSolidGeometry(1, 1, plane);

const ring = new THREE.RingGeometry(2, 4, 32);
addSolidGeometry(2, 1, ring);

{
  const shape = new THREE.Shape();
  const x = -2.5;
  const y = -5;
  shape.moveTo(x + 2.5, y + 2.5);
  shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
  const curveSegments = 10;

  const heartShape = new THREE.ShapeGeometry(shape, curveSegments);
  addSolidGeometry(-2, 0, heartShape);
}

const sphere = new THREE.SphereGeometry(4, 9, 9, 0.2, 2);
addSolidGeometry(-1, 0, sphere);

const torus = new THREE.TorusGeometry(3, 2, 12, 32);
addSolidGeometry(0, 0, torus);

const torusKnot = new THREE.TorusKnotGeometry(3, 1, 64, 10, 3, 4);
addSolidGeometry(1, 0, torusKnot);

const icosahedron = new THREE.IcosahedronBufferGeometry(4);
addSolidGeometry(2, 0, icosahedron);

const octahedron = new THREE.OctahedronGeometry(3);
addSolidGeometry(-2, -1, octahedron);

const tetrahedron = new THREE.TetrahedronGeometry(6);
addSolidGeometry(-1, -1, tetrahedron);

{
  const verticesOfCube = [
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
    -1, 1, 1,
  ];
  const indicesOfFaces = [
    2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2,
    3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
  ];
  const radius = 6;

  const detail = 1;

  const polyhedron = new THREE.PolyhedronGeometry(
    verticesOfCube,
    indicesOfFaces,
    radius,
    detail
  );

  addSolidGeometry(0, -1, polyhedron);
}

{
  function klein(v, u, target) {
    u *= Math.PI;
    v *= 2 * Math.PI;
    u = u * 2;

    let x;
    let z;

    if (u < Math.PI) {
      x =
        3 * Math.cos(u) * (1 + Math.sin(u)) +
        2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
      z =
        -8 * Math.sin(u) -
        2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
      x =
        3 * Math.cos(u) * (1 + Math.sin(u)) +
        2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
      z = -8 * Math.sin(u);
    }

    const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

    target.set(x, y, z).multiplyScalar(0.75);
  }

  const slices = 25;
  const stacks = 25;
  const parametricGeometry = new THREE.ParametricGeometry(
    klein,
    slices,
    stacks
  );

  addSolidGeometry(1, -1, parametricGeometry);
}

// exception: textGeometry (need to use async await)
// remember to copy font file to dist (problem with parcel)
{
  const loader = new THREE.FontLoader();

  function loadFont(url) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });
  }

  async function doIt() {
    const font = await loadFont('../helvetiker_bold.typeface.json');
    console.log(font);
    const geometry = new THREE.TextGeometry('boink', {
      font: font,
      size: 3.0,
      height: 1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.3,
      bevelSegments: 5,
    });
    const mesh = new THREE.Mesh(geometry, createMaterial());

    // make text rotate around is center
    geometry.computeBoundingBox();
    geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);
    const parent = new THREE.Object3D();
    parent.add(mesh);

    addObject(2, -1, parent);
  }

  doIt();
}

const edges = new THREE.EdgesGeometry(torus);
addLineGeometry(-1, -2, edges);

const wireframe = new THREE.WireframeGeometry(cylinder);
addLineGeometry(0, -2, wireframe);

const points = new THREE.Points(
  icosahedron,
  new THREE.PointsMaterial({ color: 'red', sizeAttenuation: false, size: 3 })
);
addObject(1, -2, points);

// rendering
function resizeRenderer(renderer) {
  // check if css display size (clientWidth, clientHeight) is same as resolution (width, height)
  // if not, change renderer size and return the condition
  const canvas = renderer.domElement;
  const width = (canvas.clientWidth * window.devicePixelRatio) | 0;
  const height = (canvas.clientHeight * window.devicePixelRatio) | 0;
  const needsResize = canvas.width !== width || canvas.height !== height;
  if (needsResize) {
    renderer.setSize(width, height, false);
  }
  return needsResize;
}

function render(time) {
  time *= 0.001;

  // loop through array and set rotation

  // cubes.forEach((cube, i) => {
  //   const speed = i * 0.1 + 1;
  //   const rotation = time * speed;
  //   cube.rotation.x = cube.rotation.y = rotation;
  // });

  objects.forEach((object, i) => {
    const speed = i * 0.1 + 1;
    const rotation = time * speed;
    object.rotation.x = object.rotation.y = rotation;
  });

  // make responsive: if the canvas was resized, set aspect ratio of camera so it's responsive
  if (resizeRenderer(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
