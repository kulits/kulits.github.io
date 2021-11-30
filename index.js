import * as THREE from "https://cdn.skypack.dev/pin/three@v0.134.0-mlfrkS6HEbKKwwCDDo6H/mode=imports,min/optimized/three.js";
import { GLTFLoader } from "https://cdn.skypack.dev/pin/three@v0.134.0-mlfrkS6HEbKKwwCDDo6H/mode=imports,min/unoptimized/examples/jsm/loaders/GLTFLoader.js";

let canvas, camera, scene, renderer;

const objects = [];

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", onDocumentMouseMove);

init();
animate();

function init() {
  canvas = document.getElementById("bg-canvas");

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.z = 3;
  camera.focalLength = 3;

  scene = new THREE.Scene();

  const loader = new GLTFLoader();
  loader.load(
    "gumbo.glb",
    function (gltf) {
      for (let i = 0; i < 100; i++) {
        const mesh = gltf.scene.children[0].clone();
        mesh.material = new THREE.MeshNormalMaterial();

        const unif = (range) => range * (Math.random() - 0.5);
        mesh.rx = unif(0.1);
        mesh.ry = unif(0.1);
        mesh.rz = unif(0.1);

        const scale = 0.02 * (0.5 + Math.random());
        mesh.scale.set(scale, scale, scale);

        scene.add(mesh);

        objects.push(mesh);
      }
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const width = window.innerWidth || 2;
  const height = window.innerHeight || 2;

  renderer.setSize(width, height);

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor("lightgray");

  const light = new THREE.AmbientLight("gray", 0.1);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight("gray", 0.7);
  scene.add(directionalLight);
  scene.add(directionalLight.target);
  directionalLight.target.position.set(1, 0, -1);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 100;
  mouseY = (event.clientY - windowHalfY) / 100;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const timer = 0.00002 * Date.now();

  camera.position.x += (mouseX - camera.position.x) * 0.005;
  camera.position.y += (-mouseY - camera.position.y) * 0.005;

  camera.lookAt(scene.position);

  for (let i = 0, il = objects.length; i < il; i++) {
    const object = objects[i];

    object.position.x = 5 * Math.cos(timer + i);
    object.position.y = 5 * Math.sin(timer + i * 1.1);
    object.position.z = 5 * Math.sin(timer + i * 1.1 * 1.1);

    object.rotateX(object.rx);
    object.rotateY(object.ry);
    object.rotateX(object.rz);
  }

  renderer.render(scene, camera);
}
