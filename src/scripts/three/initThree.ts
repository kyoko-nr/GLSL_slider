import { Clock, Mesh, PerspectiveCamera, WebGLRenderer } from "three";
import { createEnvironment } from "./createEnvironment";
import {
  createMesh,
  onChangeUniformForward,
  onChangeUniformRatio,
  tickMesh,
  updateOnResize,
} from "./createImages";
import { initGUI } from "./GUI/createGui";

/**
 * initialize Three.js
 */
export const initThree = () => {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (app) {
    const { renderer, camera, scene } = createEnvironment(app);

    const size = { width: app.clientWidth, height: app.clientHeight };
    const images = createMesh(size, renderer.getPixelRatio());
    scene.add(images);

    app.appendChild(renderer.domElement);

    const clock = new Clock();

    // ---------- three animation
    const tick = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
      tickMesh(clock.getElapsedTime() * 0.5);
    };
    tick();

    // ---------- resize
    window.addEventListener("resize", () =>
      onResize(camera, renderer, app, images)
    );

    // ---------- lil-gui
    initGUI({
      onChangeForward: onChangeUniformForward,
      onChangeRatio: onChangeUniformRatio,
    });
  }
};

const onResize = (
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  app: HTMLDivElement,
  images: Mesh
) => {
  const size = { width: app.clientWidth, height: app.clientHeight };
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  // resize images
  const cameraZ = camera.position.z;
  const distance = cameraZ - images.position.z;
  const vFov = (camera.fov * Math.PI) / 180;
  const scaleY = 2 * Math.tan(vFov / 2) * distance;
  const scaleX = scaleY * camera.aspect;
  images.scale.set(scaleX, scaleY, 1);
  // update images' mesh
  updateOnResize(size, dpr);
};
