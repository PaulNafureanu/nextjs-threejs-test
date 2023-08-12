import * as Three from "three";
import * as Dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function InitThreeJS() {
  console.log("Init Three JS");

  const renderer = new Three.WebGLRenderer();
  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const gui = new Dat.GUI();

  const scene = new Three.Scene();

  const camera = new Three.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(-10, 15, 75);

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update();

  const ambientLight = new Three.AmbientLight(0x333);
  scene.add(ambientLight);

  const directionalLight = new Three.DirectionalLight(0xfff, 0.8);
  scene.add(directionalLight);

  directionalLight.position.set(-30, 30, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.bottom = -12;
  directionalLight.shadow.camera.top = 12;

  const axesHelper = new Three.AxesHelper(5);
  scene.add(axesHelper);

  const gridHelper = new Three.GridHelper(30);
  scene.add(gridHelper);

  const dLightHelper = new Three.DirectionalLightHelper(directionalLight, 5);
  scene.add(dLightHelper);

  const dLightShadowHelper = new Three.CameraHelper(
    directionalLight.shadow.camera
  );
  scene.add(dLightShadowHelper);

  const planeGeometry = new Three.PlaneGeometry(30, 30);
  const planeMaterial = new Three.MeshStandardMaterial({
    color: 0xffffff,
    side: Three.DoubleSide,
  });
  const plane = new Three.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;

  const boxGeometry = new Three.BoxGeometry();
  const boxMaterial = new Three.MeshBasicMaterial({ color: 0x00ff00 });
  const box = new Three.Mesh(boxGeometry, boxMaterial);
  scene.add(box);

  const sphereRadius = 4;
  const sphereGeometry = new Three.SphereGeometry(sphereRadius);
  const sphereMaterial = new Three.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false,
  });
  const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  scene.add(sphere);

  const options = {
    sphereColor: "#ff00ff",
    sphereWireframe: false,
    sphereSpeed: 0.01,
  };

  gui.addColor(options, "sphereColor").onChange((e) => {
    sphere.material.color.set(e);
  });

  gui.add(options, "sphereWireframe").onChange((e) => {
    sphere.material.wireframe = e;
  });

  gui.add(options, "sphereSpeed", 0, 0.1);

  let step = 0;

  function boxAnimate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    step += options.sphereSpeed;
    sphere.position.y = 10 * Math.abs(Math.sin(step)) + sphereRadius;

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(boxAnimate);
}
