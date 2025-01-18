import { Clock, PerspectiveCamera, WebGLRenderer } from "three";
import { createEnvironment } from "./createEnvironment";
import { createMesh, tickMesh } from "./createImages";

/**
 * initialize Three.js
 */
export const initThree = () => {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (app) {
    const { renderer, camera, scene } = createEnvironment(app);

    const size = { width: app.clientWidth, height: app.clientHeight };
    const images = createMesh(size);
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
    window.addEventListener("resize", () => onResize(camera, renderer, app));
  }
};

const onResize = (
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  app: HTMLDivElement
) => {
  const size = { width: app.clientWidth, height: app.clientHeight };
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
