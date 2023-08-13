export default async function init() {
  const Three = await import("three");
  const { OrbitControls } = await import(
    "three/examples/jsm/controls/OrbitControls"
  );

  const starsTexture = "/img/stars.jpg";

  const renderer = new Three.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new Three.Scene();
  const camera = new Three.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const axesHelper = new Three.AxesHelper(5);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(-90, 140, 140);
  controls.update();

  const ambientLight = new Three.AmbientLight(0x333333);
  scene.add(ambientLight);

  const cubeTextureLoader = new Three.CubeTextureLoader();
  scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
  ]);

  const textureLoader = new Three.TextureLoader();

  function animation() {
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animation);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
