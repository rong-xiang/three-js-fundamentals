import * as THREE from 'three';

console.log('Hello world!');

function main() {
  // CREATING A SCENE

  // select the canvas element in html
  const canvas = document.querySelector('#c');

  // 1) create a WebGLRenderer
  const renderer = new THREE.WebGLRenderer({ canvas });
  // const renderer = new THREE.WebGLRenderer();
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  // 2) create a camera
  // define frustrum: 3d space that camera will capture
  const fov = 75; // field of view (in degrees for perspective camera)
  const aspect = 2; // aspect ratio (default is 300x150 pixels)
  const near = 0.1; // space in front of camera that will be rendered
  const far = 5; // space in front of camera that will be rendered

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  // 3) create a scene
  const scene = new THREE.Scene();

  // 4) create a box geometry
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // 5) create a basic material and set color
  // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // not affected by light
  // const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // affected by light

  // 6) create a mesh, which combines: geometry, materaisl, position/orientation/scale
  // const cube = new THREE.Mesh(geometry, material);

  // 7) add mesh to scene
  // scene.add(cube);

  // 8) render scene by passing scene and camera into renderer
  // renderer.render(scene, camera);

  // cube maker
  function makeCube(color, x) {
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;

    scene.add(cube);
    return cube;
  }

  // store cubes in an array
  const cubes = [
    makeCube(0x44aa88, 0),
    makeCube(0xaa8844, -2),
    makeCube(0x88aa44, 2),
  ];

  // ADDING A LIGHT
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  // ANIMATING USING A RENDER LOOP

  // helper: see if canvas needs to be resized, resize if yes and return a boolean
  function canvasResize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needsResize = canvas.width !== width || canvas.height !== height;
    if (needsResize) {
      renderer.setSize(width, height, false);
    }
    return needsResize;
  }

  // render loop
  function render(time) {
    time *= 0.001; // convert time from milliseconds to seconds

    // loop through cube array and set rotation
    cubes.forEach((cube, i) => {
      const speed = 1 + i * 0.1;
      const rotation = speed * time;
      cube.rotation.x = rotation;
      cube.rotation.y = rotation;
    });

    // if the canvas was resized, set the aspect ratio of camera to canvas so it's responsive
    if (canvasResize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix(); // must call after changing camera parameters
    }

    renderer.render(scene, camera); // render scene by passing scene and camera into renderer
    requestAnimationFrame(render); // loop
  }

  // requests browser to animate something, pass in fxn that will be called
  requestAnimationFrame(render);
}

main();
