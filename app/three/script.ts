import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function InitThreeJS() {
  console.log("Init Three JS");

  const renderer = new Three.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new Three.Scene();

  const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(1, 2, 7);

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update();

  const axesHelper = new Three.AxesHelper(5);
  scene.add(axesHelper);

  const boxGeometry = new Three.BoxGeometry();
  const boxMaterial = new Three.MeshBasicMaterial({ color: 0x00ff00 });
  const box = new Three.Mesh(boxGeometry, boxMaterial);
  scene.add(box);

  function boxAnimate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(boxAnimate);
}
