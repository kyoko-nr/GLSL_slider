import "../styles/style.css";
import { initThree } from "./three/initThree";

const init = () => {
  initThree();
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
