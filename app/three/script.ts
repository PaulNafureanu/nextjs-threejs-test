export default async function init() {
  const Three = await import("three");
  const { OrbitControls } = await import(
    "three/examples/jsm/controls/OrbitControls"
  );

  const starsTexture = "/img/stars.jpg";
  const earthTexture = "/img/earth.jpg";
  const jupiterTexture = "/img/jupiter.jpg";
  const marsTexture = "/img/mars.jpg";
  const mercuryTexture = "/img/mercury.jpg";
  const neptuneTexture = "/img/neptune.jpg";
  const plutoTexture = "/img/pluto.jpg";
  const saturnRingTexture = "/img/saturnRing.png";
  const saturnTexture = "/img/saturn.jpg";
  const sunTexture = "/img/sun.jpg";
  const uranusRingTexture = "/img/uranusRing.png";
  const uranusTexture = "/img/uranus.jpg";
  const venusTexture = "/img/venus.jpg";

  const pixelRatio = window.devicePixelRatio || 1;
  const canvasWidth = window.innerWidth * pixelRatio;
  const canvasHeight = window.innerHeight * pixelRatio;

  const renderer = new Three.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new Three.Scene();
  const camera = new Three.PerspectiveCamera(
    75,
    canvasWidth / canvasHeight,
    0.1,
    10000
  );

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(-90, 200, 200);
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

  const sunGeo = new Three.SphereGeometry(16, 30, 30);
  const sunMat = new Three.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
  });
  const sun = new Three.Mesh(sunGeo, sunMat);
  scene.add(sun);

  const pointLight = new Three.PointLight(0xffeeee, 5000, 1000);
  sun.add(pointLight);

  function createPlanet(
    size: number,
    texture: string,
    position: number,
    ringInnerRadius?: number,
    ringOuterRadius?: number,
    ringTexture?: string,
    ringRotation?: number
  ) {
    const geo = new Three.SphereGeometry(size, 30, 30);
    const mat = new Three.MeshStandardMaterial({
      map: textureLoader.load(texture),
    });
    const mesh = new Three.Mesh(geo, mat);
    const obj = new Three.Object3D();
    scene.add(obj);
    obj.add(mesh);
    mesh.position.x = position;

    const circleGeo = new Three.RingGeometry(position, position + 0.1, 128);
    const circleMat = new Three.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    });
    const circle = new Three.LineLoop(circleGeo, circleMat);
    circle.rotation.x = -0.5 * Math.PI;
    scene.add(circle);

    if (ringInnerRadius && ringOuterRadius && ringTexture) {
      const ringGeo = new Three.RingGeometry(
        ringInnerRadius,
        ringOuterRadius,
        32
      );
      const ringMat = new Three.MeshBasicMaterial({
        map: textureLoader.load(ringTexture),
        side: Three.DoubleSide,
      });
      const ringMesh = new Three.Mesh(ringGeo, ringMat);
      obj.add(ringMesh);
      ringMesh.position.x = position;
      if (ringRotation) ringMesh.rotation.x = ringRotation * Math.PI;
    }

    return { mesh, obj };
  }

  const mercury = createPlanet(3.2, mercuryTexture, 28);
  const venus = createPlanet(5.8, venusTexture, 44);
  const earth = createPlanet(6, earthTexture, 62);
  const mars = createPlanet(4, marsTexture, 78);
  const jupiter = createPlanet(4, jupiterTexture, 100);
  const saturn = createPlanet(
    10,
    saturnTexture,
    138,
    10,
    20,
    saturnRingTexture,
    -0.5
  );
  const uranus = createPlanet(
    7,
    uranusTexture,
    176,
    7,
    12,
    uranusRingTexture,
    -0.5
  );
  const neptune = createPlanet(7, neptuneTexture, 200);
  const pluto = createPlanet(2.8, plutoTexture, 216);

  //Set initial rotation around sun:
  mercury.obj.rotateY(Math.random() * 100);
  venus.obj.rotateY(Math.random() * 100);
  earth.obj.rotateY(Math.random() * 100);
  mars.obj.rotateY(Math.random() * 100);
  jupiter.obj.rotateY(Math.random() * 100);
  saturn.obj.rotateY(Math.random() * 100);
  uranus.obj.rotateY(Math.random() * 100);
  neptune.obj.rotateY(Math.random() * 100);
  pluto.obj.rotateY(Math.random() * 100);

  function animation() {
    //Self-rotation
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);

    //Around-sun-rotation:
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animation);

  window.addEventListener("keydown", (e) => {
    const zoom = 10;
    let direction = new Three.Vector3();
    camera.getWorldDirection(direction);

    switch (e.key) {
      case "ArrowUp": {
        camera.position.addScaledVector(direction, zoom);
        break;
      }
      case "ArrowDown": {
        camera.position.addScaledVector(direction, -zoom);
        break;
      }
    }
  });

  window.addEventListener("resize", () => {
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidth, canvasHeight);
  });
}
