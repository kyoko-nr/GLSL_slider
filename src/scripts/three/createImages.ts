import {
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  TextureLoader,
  Vector2,
} from "three";
import image0 from "../../assets/001.jpg";
import image1 from "../../assets/002.jpg";
import noise from "../../assets/noise.jpg";

import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";
import { Size } from "../types/Size";

const loader = new TextureLoader();

let mesh: Mesh | null = null;

/**
 * create mesh
 * @param size plane size
 * @param dpr device pixel ratio
 */
export const createMesh = (size: Size, dpr: number) => {
  const geo = new PlaneGeometry(size.width, size.height, 1, 1);

  const texture0 = loader.load(image0);
  const texture1 = loader.load(image1);
  const noiseTexture = loader.load(noise);

  const mat = new ShaderMaterial({
    uniforms: {
      uResolution: {
        value: new Vector2(size.width * dpr, size.height * dpr),
      },
      uTexture0: { value: texture0 },
      uTexture1: { value: texture1 },
      uNoiseTexture: { value: noiseTexture },
      uTime: { value: 0.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    depthTest: false,
  });
  mesh = new Mesh(geo, mat);
  mesh.position.set(0, 0, 0);
  return mesh;
};

/**
 * animate mesh
 * @param {number} elapsedTime
 */
export const tickMesh = (elapsedTime: number) => {
  if (!mesh) {
    return;
  }
  (mesh.material as ShaderMaterial).uniforms.uTime.value = elapsedTime;
};

/**
 * update mesh on resize
 * @param size app size
 * @param dpr device pixel ratio
 */
export const updateOnResize = (size: Size, dpr: number) => {
  if (!mesh) {
    return;
  }
  const mat = mesh.material as ShaderMaterial;
  mat.uniforms.uResolution.value = new Vector2(
    size.width * dpr,
    size.height * dpr
  );
};
