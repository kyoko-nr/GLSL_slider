import GUI from "lil-gui";

type Props = {
  onChangeRatio: (val: number) => void;
  onChangeForward: (val: boolean) => void;
};

/**
 * call after createMesh
 */
export const initGUI = ({ onChangeRatio, onChangeForward }: Props) => {
  const gui = new GUI();

  const distortion = {
    ratio: 0,
    forward: true,
  };

  gui.add(distortion, "ratio", 0, 1, 0.01).onChange(onChangeRatio);
  gui.add(distortion, "forward").onChange(onChangeForward);
};
