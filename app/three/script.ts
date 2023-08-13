import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default async function InitThreeJS() {
  const Dat = await import("dat.gui");

  console.log("Init Three JS");

  const renderer = new Three.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0x336688);

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const gui = new Dat.GUI();

  const scene = new Three.Scene();

  const nebula = "/img/nebula.jpg";
  const stars = "/img/stars.jpg";

  const textureLoader = new Three.TextureLoader();
  const cubeTextureLoader = new Three.CubeTextureLoader();
  scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars,
  ]);
  // scene.background = textureLoader.load(stars.src);

  const camera = new Three.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(-10, 15, 75);

  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.update();

  let zoomSpeed = 5;

  window.addEventListener("keydown", (event) => {
    const direction = new Three.Vector3();
    camera.getWorldDirection(direction);

    switch (event.key) {
      case "ArrowUp":
        camera.position.addScaledVector(direction, zoomSpeed);
        break;
      case "ArrowDown":
        camera.position.addScaledVector(direction, -zoomSpeed);
        break;
    }
  });

  const mousePosition = new Three.Vector2();

  window.addEventListener("mousemove", (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const ambientLight = new Three.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // const directionalLight = new Three.DirectionalLight(0xfff, 0.8);
  // scene.add(directionalLight);

  // directionalLight.position.set(-30, 30, 0);
  // directionalLight.castShadow = true;
  // directionalLight.shadow.camera.bottom = -12;
  // directionalLight.shadow.camera.top = 12;

  const spotLight = new Three.SpotLight(0xffffff, 1000);
  scene.add(spotLight);

  spotLight.castShadow = true;
  spotLight.position.set(-30, 30, 0);
  spotLight.angle = 0.25;

  const sLightHelper = new Three.SpotLightHelper(spotLight);
  scene.add(sLightHelper);

  const axesHelper = new Three.AxesHelper(5);
  scene.add(axesHelper);

  const gridHelper = new Three.GridHelper(30);
  scene.add(gridHelper);

  // const dLightHelper = new Three.DirectionalLightHelper(directionalLight, 5);
  // scene.add(dLightHelper);

  // const dLightShadowHelper = new Three.CameraHelper(
  //   directionalLight.shadow.camera
  // );
  // scene.add(dLightShadowHelper);

  const planeGeometry = new Three.PlaneGeometry(30, 30);
  const planeMaterial = new Three.MeshStandardMaterial({
    color: 0xffffff,
    side: Three.DoubleSide,
  });
  const plane = new Three.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;

  const boxGeometry = new Three.BoxGeometry(4, 4, 4);
  const boxMaterial = new Three.MeshBasicMaterial({
    color: 0x00ff00,
    map: textureLoader.load(nebula),
  });
  const box = new Three.Mesh(boxGeometry, boxMaterial);
  box.position.set(0, 15, 15);
  scene.add(box);

  const sphereRadius = 4;
  const sphereGeometry = new Three.SphereGeometry(sphereRadius);
  const sphereMaterial = new Three.MeshStandardMaterial({
    color: 0xeeff40,
    wireframe: false,
  });
  const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  scene.add(sphere);

  const options = {
    zoomSpeed: 5,
    sphereColor: "#ff00ff",
    sphereWireframe: false,
    sphereSpeed: 0.05,
    sLightIntensity: 1,
    sLightAngle: 0.25,
    sLightPenumbra: 0,
  };

  gui.addColor(options, "sphereColor").onChange((e) => {
    sphere.material.color.set(e);
  });

  gui.add(options, "sphereWireframe").onChange((e) => {
    sphere.material.wireframe = e;
  });

  gui.add(options, "zoomSpeed", 1, 10).onChange((e) => {
    zoomSpeed = e;
  });

  gui.add(options, "sphereSpeed", 0, 0.2);

  gui.add(options, "sLightAngle", 0.1, 1);
  gui.add(options, "sLightIntensity", 0.1, 10);
  gui.add(options, "sLightPenumbra", 0, 1);

  let step = 0;

  const rayCaster = new Three.Raycaster();
  const sphereColor = sphere.material.color;
  const sphereId = sphere.id;

  const plane2Geometry = new Three.PlaneGeometry(10, 10, 10, 10);
  const plane2Material = new Three.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });
  const plane2 = new Three.Mesh(plane2Geometry, plane2Material);
  plane2.position.set(10, 10, 15);
  scene.add(plane2);

  plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
  plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
  plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
  const lastPositionZ = plane2.geometry.attributes.position.array.length - 1;
  plane2.geometry.attributes.position.array[lastPositionZ] -=
    10 * Math.random();

  const assetLoader = new GLTFLoader();

  assetLoader.load("/assets/monkey.glb", (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-4, 12, 5);
  });

  function boxAnimate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    step += options.sphereSpeed;
    sphere.position.y = 10 * Math.abs(Math.sin(step)) + sphereRadius;

    spotLight.angle = options.sLightAngle;
    spotLight.intensity = 1000 * options.sLightIntensity;
    spotLight.penumbra = options.sLightPenumbra;
    sLightHelper.update();

    // rayCaster.setFromCamera(mousePosition, camera);
    // const intersects = rayCaster.intersectObjects(scene.children);
    // // console.log(intersects);

    // for (let i = 0; i < intersects.length; i++) {
    //   if (intersects[i].object.id === sphere.id) {
    //     let sphereIntersected = intersects[i] as Three.Intersection<
    //       Three.Mesh<Three.SphereGeometry, Three.MeshBasicMaterial>
    //     >;

    //     sphereIntersected.object.material.color.set(0xff0000);
    //   }
    // }

    // plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    // plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    // plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    // plane2.geometry.attributes.position.array[lastPositionZ] =
    //   10 * Math.random();
    // plane2.geometry.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(boxAnimate);
}
