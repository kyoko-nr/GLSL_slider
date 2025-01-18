import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Size } from "../types/Size";

const FOV = 60;

const createRenderer = (size: Size) => {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size.width, size.height);
  return renderer;
};

const createCamera = (size: Size) => {
  const camera = new PerspectiveCamera(
    FOV,
    size.width / size.height,
    0.1,
    1000
  );
  camera.position.z = 700;
  return camera;
};

const createScene = () => {
  return new Scene();
};

/**
 * Create Three.js environment.
 */
export const createEnvironment = (app: HTMLDivElement) => {
  const size = { width: app.clientWidth, height: app.clientHeight };
  const renderer = createRenderer(size);
  const camera = createCamera(size);
  const scene = createScene();
  return { renderer, camera, scene };
};
